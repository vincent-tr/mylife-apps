import { React, PropTypes, useMemo, useDispatch } from 'mylife-tools-ui';
import { usePersonView, personComparer } from '../../../common/shared-views';
import { personAddDialog } from '../../../common/person-add-dialog';
import DetailList from './detail-list';
import { addPersonToDocument, removePersonFromDocument, createPersonWithDocument } from '../../actions';

type FIXME_any = any;

const useConnect = () => {
  const dispatch = useDispatch<FIXME_any>();
  return useMemo(() => ({
    createPerson: (document, firstName, lastName) => dispatch(createPersonWithDocument(document, firstName, lastName)),
    addPerson : (document, person) => dispatch(addPersonToDocument(document, person)),
    removePerson : (document, person) => dispatch(removePersonFromDocument(document, person)),
  }), [dispatch]);
};

const DetailPersons = ({ documentWithInfo }) => {
  const { persons, view } = usePersonView();
  const { addPerson, removePerson, createPerson } = useConnect();

  const { document } = documentWithInfo;
  const personIds = document.persons;

  const addablePersons = useMemo(() => {
    // the same document cannot be added twice in an person
    const idSet = new Set(personIds);
    return persons.filter(person => !idSet.has(person._id));
  }, [personIds, persons]);

  const personList = useMemo(() => {
    const list = [];
    for(const id of personIds) {
      const person = view.get(id);
      if(!person) {
        // view not ready
        continue;
      }

      list.push(person);
    }

    list.sort(personComparer);
    return list;
  }, [personIds, view]);

  const onNew = async () => {
    const { result, firstName, lastName } = await personAddDialog();
    if(result !== 'ok') {
      return;
    }

    createPerson(document, firstName, lastName);
  };

  return (
    <DetailList
      title={'Personnes'}
      addTooltip={'Ajouter une personne à un document'}
      newTooltip={'Nouvelle personne ...'}
      deleteTooltip={'Enlever la personne du document'}
      onAdd={person => addPerson(document, person)}
      onNew={onNew}
      onDelete={person => removePerson(document, person)}
      items={personList}
      addableItems={addablePersons}
    />
  );
};

DetailPersons.propTypes = {
  documentWithInfo: PropTypes.object.isRequired
};

export default DetailPersons;
