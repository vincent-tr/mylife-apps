# mylife-trading

MyLife Trading

## Notes: 
- RSI input: closing prices (need period + 1 values) ( https://www.macroption.com/rsi-calculation/ )
- Bollinger Band input: same input
- Gestion de risque:
 - Ne pas risquer de perdre + de 2% du capital par position. (Positionner le stop loss + pas trop de levier)
 - Montant investi / stop loss (pips) / valeur du pip
 - https://www.professeurforex.com/formation-forex/lecon-14-introduction-a-la-gestion-du-risque/
- stratégie scalping forex M1: http://knock-on-wood.over-blog.com/2018/07/forex-et-scalping.html

## Glossary:
- STOP = stop loss
- STOP garanti = stop loss garanti avec spread en plus (frais)
- LIMITE = take profit
- ORDRE LIMITE = déclenchement de la position à partir d'un certain seuil
- deal reference/id (??):
 - reference = command identifier
 - id = position identifier
- effet de levier: sur IG => 1:30 possible, en fait on achete juste la quantite de lot qu on veut (en fonction de la perte possible), le broker bloque si ce n est pas possible (levier trop important par rapport au capital)

## Backtest loading

- https://www.histdata.com/download-free-forex-historical-data/?/ascii/1-minute-bar-quotes/eurusd/2019
- scp ~/Downloads/DAT_ASCII_EURUSD_M1_2019.csv arch-desktop:/home/vincent
- ssh arch-desktop
- tr ';' ',' < DAT_ASCII_EURUSD_M1_2019.csv > data.csv
- docker run --rm -ti -v ~/data.csv:/data.csv --network mongo_default mongo mongoimport --host=mongo --db=mylife-trading --collection=wipimport --file=/data.csv --type=csv  --columnsHaveTypes --fields="date.date(20060102 150405),open.double(),high.double(),low.double(),close.double(),volume.double()"
- docker run --rm -ti --network mongo_default mongo mongo --host=mongo
 - use mylife-trading
 - db.wipimport.update({}, { $unset: { volume: null } }, { multi: true });
 - db.wipimport.find().forEach((rec) => { const newDate = new Date(rec.date.getTime() + 5 * 3600 *  1000); db.wipimport.update({ _id: rec._id }, { $set: { date: newDate } }); });


Reference:
- https://www.histdata.com/download-free-forex-data/
