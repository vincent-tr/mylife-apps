'use strict';

import { React, PropTypes, mui, immutable, useMemo } from 'mylife-tools-ui';
import { getFieldName } from '../../common/metadata-utils';
import { useKeywordView } from '../../common/keyword-view';

const useStyles = mui.makeStyles(theme => {
  const iconColor = mui.fade(theme.palette.text.primary, 0.26);
  return {
    editor: {
      marginLeft: theme.spacing(1)
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

const HeaderKeywords = ({ documents }) => {
  const classes = useStyles();
  const keywordUsage = useMemo(() => getKeywordUsage(documents), [documents]);
  const list = useMemo(() => keywordUsage.keySeq().toArray(), [keywordUsage]);
  const { keywords: options } = useKeywordView();

  console.log(keywordUsage);
  const onValuesChange = (values) => console.log(values);
  const onAddAll = (keyword) => console.log(keyword);

  return (
    <>
      <mui.Typography>
        {getFieldName('document', 'keywords')}
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
  for(const { document } of documents) {
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
