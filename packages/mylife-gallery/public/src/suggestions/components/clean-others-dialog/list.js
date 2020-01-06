'use strict';

import humanize from 'humanize';
import { React, PropTypes, mui } from 'mylife-tools-ui';
import * as documentUtils from '../../../common/document-utils';

const List = ({ documents, selection, setSelection }) => {
  const selectOne = document => setSelection(set => set.add(document._id));
  const unselectOne = document => setSelection(set => set.delete(document._id));
  const selectAll = () => setSelection(set => set.union(documents.map(doc => doc._id)));
  const unselectAll = () => setSelection(set => set.clear());

  const handleSelectAllClick = event => {
    if (event.target.checked) {
      selectAll();
    } else {
      unselectAll();
    }
  };

  const handleSelectClick = (event, document) => {
    if (event.target.checked) {
      selectOne(document);
    } else {
      unselectOne(document);
    }
  };

  return (
    <mui.Table>
      <mui.TableHead>
        <mui.TableRow>
          <mui.TableCell padding='checkbox'>
            <mui.Checkbox
              indeterminate={documents && selection.size > 0 && selection.size < documents.length}
              checked={documents && selection.size === documents.length}
              onChange={handleSelectAllClick}
            />
          </mui.TableCell>
          <mui.TableCell>Titre</mui.TableCell>
          <mui.TableCell>Chemin</mui.TableCell>
          <mui.TableCell>Taille</mui.TableCell>
          <mui.TableCell>Erreur au chargement</mui.TableCell>
        </mui.TableRow>
      </mui.TableHead>
      <mui.TableBody>
        {documents.map(document => {
          const info = documentUtils.getInfo(document);
          const selected = selection.has(document._id);
          return (
            <mui.TableRow key={document._id}
              hover
              onClick={event => handleSelectClick(event, document)}
              tabIndex={-1}
              selected={selected}
            >
              <mui.TableCell padding='checkbox'>
                <mui.Checkbox checked={selected} />
              </mui.TableCell>
              <mui.TableCell>{info.title}</mui.TableCell>
              <mui.TableCell>{document.paths.map(p => p.path).join('; ')}</mui.TableCell>
              <mui.TableCell>{humanize.filesize(document.fileSize)}</mui.TableCell>
              <mui.TableCell>{document.loadingError && <mui.Button>Show</mui.Button>}</mui.TableCell>
            </mui.TableRow>
          );
        })}
      </mui.TableBody>
    </mui.Table>
  );
};

List.propTypes = {
  documents: PropTypes.array.isRequired,
  selection: PropTypes.object.isRequired,
  setSelection: PropTypes.func.isRequired
};

export default List;
