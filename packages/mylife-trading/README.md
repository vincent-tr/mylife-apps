# mylife-trading

MyLife Trading

## Notes: 
- RSI input: closing prices (need period + 1 values) ( https://www.macroption.com/rsi-calculation/ )
- Bollinger Band input: same input
- Gestion de risque:
 - Ne pas risquer de perdre + de 2% du capital par position. (Positionner le stop loss + pas trop de levier)
 - Montant investi / stop loss (pips) / valeur du pip
 - https://www.professeurforex.com/formation-forex/lecon-14-introduction-a-la-gestion-du-risque/

## Stratégies:
 - stratégie scalping forex M1: http://knock-on-wood.over-blog.com/2018/07/forex-et-scalping.html
 - https://admiralmarkets.com/fr/formation/articles/strategie-de-forex/strategie-forex-scalping-1-minute
 - extrême stochastique : https://youtu.be/ng6MzSuSjs8
 - scalping de vagues : https://youtu.be/W2Jcxv5qIKE
 - inside bar M15 :  https://www.youtube.com/watch?v=lOWyNWl4bcE
 - scalping system 10 points (m1) : https://www.youtube.com/watch?v=6LASyXHshYs
 - https://forexexperts.net/index.php/trade-strategy/scalping-strategies
 - forex scalping m1 sar/sma (hit&run) https://www.forexmt4indicators.com/sma-parabolic-sar-forex-scalping-strategy/
 - 50 SMA plate = détection de range ? https://forex-strategies-revealed.com/range-bound-trading/50maangle
 - ig 4 stratégies : https://www.ig.com/en/trading-strategies/four-simple-scalping-trading-strategies-190131
 - The Most Simple Scalping Strategy To Trade The Forex Market! : https://www.forex.academy/the-most-simple-scalping-strategy-to-trade-the-forex-market/

## Forex devises majeures:
 - EURUSD (Euro - Dollar américain)
 - USDJPY (Dollar américain - Yen japonais)
 - GBPUSD (Livre sterling- Dollar américain)
 - AUDUSD (Dollar australien - Dollar américain)
 - USDCHF (Dollar américain - Franc suisse)
 - USDCAD (Dollar américain - Dollar canadien)

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
 - db.wipimport.update({}, { $unset: { volume: null }, $set: { resolution: 'm1', instrumentId: 'forex:eurusd' } }, { multi: true });
 - db.wipimport.find().forEach((rec) => { const newDate = new Date(rec.date.getTime() + 5 * 3600 *  1000); db.wipimport.update({ _id: rec._id }, { $set: { date: newDate } }); });
- creer index sur { "instrumentId": 1, "resolution": 1, "date": 1 }

Reference:
- https://www.histdata.com/download-free-forex-data/

## TODO

 - home/stats: Add detail window on stat to see orders + details (especially on mobile device)