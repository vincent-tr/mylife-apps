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


Reference:
- https://www.histdata.com/download-free-forex-data/
