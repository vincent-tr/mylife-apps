DATATYPE :
 - Nom interne (id) (exemple : amount ou batchnumber ou string ou password ou gender(m/f) )
 - Type de données js (déduit auto pour enum ou reference)
 - enum: ['liste', 'des', 'valeurs'] => indique que le type est une enum, avec sa liste de valeurs
 - reference: 'target entity id' => indique que le type est une FK avec sa cible
 - collection: 'target entity id' => indique que le type est collection 'embedded', avec l'entité cible contenue dedans, en map avec une clé string (l'entité cible n'a pas besoin de PK)
 - constraints: ['contrainte1', ['contrainte2', arg1, arg2]] (eg: ['positive', ['max', 100]])
 - (Créer un Datatype de FK par entité, automatiser la creation)

FIELD :
 - Nom interne (id)
 - Nom affiché
 - Description
 - Datatype
 - constraints: ['not-null', 'read-only']

ENTITY :
 - Parent (héritage de définition d’entité)
 - Nom interne (id)
 - Nom affiché
 - Description
 - Liste de champs
 - fonction d'affichage de l'entité
 - constraints: ['custom-constraint1', ['at-least-one-not-null', 'field1', 'field2']]
