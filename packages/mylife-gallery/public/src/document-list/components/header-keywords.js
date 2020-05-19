'use strict';

import { React, PropTypes, mui, immutable, useMemo, useDispatch, services } from 'mylife-tools-ui';
import { useKeywordView } from '../../common/keyword-view';
import { addKeywordToDocuments, removeKeywordFromDocuments } from '../actions';

const useConnect = () => {
  const dispatch = useDispatch();
  return useMemo(() => ({
    addKeywordToDocuments: (documents, keyword) => dispatch(addKeywordToDocuments(documents, keyword)),
    removeKeywordFromDocuments: (documents, keyword) => dispatch(removeKeywordFromDocuments(documents, keyword)),
  }), [dispatch]);
};

const useStyles = mui.makeStyles(theme => {
  const iconColor = mui.fade(theme.palette.text.primary, 0.26);
  return {
    editor: {
      marginLeft: theme.spacing(1),
      minWidth: 200
    },
    addIcon: {
      // like Chip impl
      color: iconColor,
      '&:hover': {
        color: mui.fade(iconColor, 0.4)
      },
      marginRight: -theme.spacing(1)
    }

  };
});

const Chip = ({ documents, keywordUsage, keyword, onAdd, ...props }) => {
  const classes = useStyles();
  const usage = keywordUsage.get(keyword);
  const canAdd = usage.size < documents.length;
  const handleAdd = e => {
    e.stopPropagation();
    onAdd();
  };

  return (
    <mui.Chip variant='outlined' label={
      <>
        {keyword}
        {canAdd && (
          <mui.Tooltip title={'Ajouter le mot clé à toute la sélection'}>
            <mui.IconButton
              size='small'
              className={classes.addIcon}
              onClick={handleAdd}
            >
              <mui.icons.AddCircle />
            </mui.IconButton>
          </mui.Tooltip>
        )}
      </>
    } {...props} />
  );
};

Chip.propTypes = {
  documents: PropTypes.array.isRequired,
  keywordUsage: PropTypes.object.isRequired,
  keyword: PropTypes.string.isRequired,
  onAdd: PropTypes.func.isRequired
};

const HeaderKeywords = ({ documents: documentsWithInfo }) => {
  const classes = useStyles();
  const { addKeywordToDocuments, removeKeywordFromDocuments } = useConnect();
  const documents = useMemo(() => documentsWithInfo.map(docWithInfo => docWithInfo.document), [documentsWithInfo]);
  const keywordUsage = useMemo(() => getKeywordUsage(documents), [documents]);
  const list = useMemo(() => keywordUsage.keySeq().toArray(), [keywordUsage]);
  const { keywords: options } = useKeywordView();

  const onValuesChange = (newValues) => {
    const { added, removed } = computeValueDiff(list, newValues);
    // should only have one value, so no need to optimize the loop

    for(const keyword of added) {
      addKeywordToDocuments(documents, keyword);
    }

    for(const keyword of removed) {
      // only remove on documents that had it
      const usage = keywordUsage.get(keyword).toArray();
      removeKeywordFromDocuments(usage, keyword);
    }
  };

  const onAddAll = (keyword) => {
    // only add on documents where it is not already
    const usage = keywordUsage.get(keyword);
    const targetDocuments = documents.filter(doc => !usage.has(doc));
    addKeywordToDocuments(targetDocuments, keyword);
  };

  return (
    <>
      <mui.Typography>
        {services.getFieldName('document', 'keywords')}
      </mui.Typography>

      <mui.Autocomplete
        className={classes.editor}
        filterSelectedOptions
        multiple
        options={options}
        freeSolo
        disableClearable
        renderTags={(values, getTagProps) =>
          values.map((keyword, index) => (
            <Chip
              key={index}
              documents={documents}
              keywordUsage={keywordUsage}
              keyword={keyword}
              onAdd={() => onAddAll(keyword)}
              {...getTagProps({ index })}
            />
          ))
        }
        renderInput={params => (
          <mui.TextField {...params} fullWidth />
        )}
        value={list}
        onChange={(e, values) => onValuesChange(values)}
      />
    </>
  );
};

HeaderKeywords.propTypes = {
  documents: PropTypes.array.isRequired
};

export default HeaderKeywords;

function getKeywordUsage(documents) {
  const keywords = new Map();
  for(const document of documents) {
    for(const keyword of document.keywords || []) {
      let documents = keywords.get(keyword);
      if(!documents) {
        documents = new Set();
        keywords.set(keyword, documents);
      }

      documents.add(document);
    }
  }
  const entries = Array.from(keywords.entries());
  const setEntries = entries.map(([keyword, documents]) => [keyword, new immutable.Set(documents)]);
  return new immutable.Map(setEntries);
}

function computeValueDiff(oldValues, newValues) {
  const oldValuesSet = new Set(oldValues);
  const newValuesSet = new Set(newValues);

  const added = [];
  const removed = [];

  for(const value of oldValues) {
    if(!newValuesSet.has(value)) {
      removed.push(value);
    }
  }

  for(const value of newValues) {
    if(!oldValuesSet.has(value)) {
      added.push(value);
    }
  }

  return { added, removed };
}
