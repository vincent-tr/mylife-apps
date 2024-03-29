export default {
  id: 'upsmon-status',
  parent: 'base',
  name: 'Statut Upsmon',
  fields: [
    { id: 'date', name: 'Date et heure auxquels les informations ont été obtenus de l\'onduleur', datatype: 'datetime' },
    { id: 'upsName', name: 'Nom de l\'onduleur', datatype: 'name' },
    { id: 'startTime', name: 'Date/heure de démarrage de l\'onduleur', datatype: 'datetime' },
    { id: 'model', name: 'Modèle de l\'onduleur', datatype: 'name' },
    { id: 'status', name: 'Statut de l\'onduleur', datatype: 'name' },
    { id: 'statusFlag', name: 'Statut de l\'onduleur', datatype: 'upsmon-status-flag' },
		{ id: 'lineVoltage', name: 'Tension courrante d\'entrée', datatype: 'voltage' },
		{ id: 'loadPercent', name: 'Pourcentage de puissance utilisée', datatype: 'percent' },
		{ id: 'batteryChargePercent', name: 'Pourcentage de charge des batteries', datatype: 'percent' },
		{ id: 'timeLeft', name: 'Temps restant en secondes d\'exécution sur batteries', datatype: 'duration' },
		{ id: 'batteryVoltage', name: 'Tension des batteries', datatype: 'voltage' },
		{ id: 'lastTransfer', name: 'Raison du dernier transfert vers les batteries', datatype: 'text' },
		{ id: 'numberTransfers', name: 'Nombre de transferts depuis le démarrage de upsmon', datatype: 'count' },
		{ id: 'xOnBattery', name: 'Date/heure du dernier transfert vers les batteries', datatype: 'datetime' },
		{ id: 'timeOnBattery', name: 'Temps sur batterie (en secondes)', datatype: 'duration' },
		{ id: 'cumulativeTimeOnBattery', name: 'Temps cumulé sur batterie depuis le démarrage de upsmon (en secondes)', datatype: 'duration' },
		{ id: 'xOffBattery', name: 'Date/heure du dernier transfert depuis les batteries', datatype: 'datetime' },
		{ id: 'nominalInputVoltage', name: 'Tension d\'entrée attendue par l\'onduleur', datatype: 'voltage' },
		{ id: 'nominalBatteryVoltage', name: 'Tension nominale de batterie ', datatype: 'voltage' },
		{ id: 'nominalPower', name: 'Puissance nominale', datatype: 'power' },
		{ id: 'firmware', name: 'Version du firmware', datatype: 'name' },
		{ id: 'outputVoltage', name: 'Tension de sortie', datatype: 'voltage' },
	]
};
