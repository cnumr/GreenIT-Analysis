# GreenIT-Analysis 


GreenIT-Analysis est une extension pour navigateur qui vous permet de quantifier les impacts environnementaux d'un parcours utilisateur complet, même derrière un firewall et / ou une authentification applicative. L'outil vérifie également l'utilisation de bonnes pratiques visant à diminuer ces impacts.

Cette extension s'inspire fortement des fonctionnalités de [EcoIndex](http://www.ecoindex.fr/) et [EcoMeter](http://www.ecometer.org/).

Elle est supportée sur toutes les versions de navigateurs basés sur chromium (à partir de la version 55 ). Elle est aussi supportée sur firefox avec quelques bonnes pratiques non supportées (du fait de limitations des API Firefox). 
A noter que bien que fonctionnant sur la version ESR de firefox, le plugin a des comportements particuliers, voir point FireFox ESR ci-après.


### Utiliser l'extension
* Ouvrir les outils de développement du navigateur (F12).   
* Aller dans l'onglet GreenIT.   
* Dans le navigateur, aller sur la page à analyser.
* Dans l'onglet GreenIT des outils de développement, cliquer sur le bouton "Lancer l'analyse".
* Les résultats s'affichent.
* Vous pouvez sauvegarder ce résultat dans un historique (seul les indicateurs sont enregistrés) via le bouton "Sauver l'analyse"
* L'historique des résultats sauvegardés est disponible via le bouton "Historique"

Pour avoir une analyse des bonnes pratiques, il faut cocher la case "Activer l'analyse des bonnes pratiques".


Quelques points de vigilance: 

* Si le nombre de requêtes est à zéro, c'est probablement parce que vous n'avez pas charger la page avec les outils de developpement démarrés. Il faut donc penser à faire un rechargement de la page.
* Pour avoir des mesures correctes, il faut préalablement vider le cache du navigateur (Dans le cas contraire, le volume transféré va être réduit si vous avez déjà consulté le site mesuré).
* L'utilisation d'un bloqueur de publicité ou autre filtre a une influence sur le résultat.

### Enregistrement du parcours utilisateur

Vous pouvez quantifier les impacts environnementaux d'un parcours utilisateur en lançant et en enregistrant des analyses sucessives après chaque page visitée. 

 Attention cependant car le plugin ne vous permet pas d'enregistrer simplement un parcours utilisateur dans le cas d'une application monopage (Single Page Application). En effet lorsque vous cliquez sur analyse, les valeurs  "Taille de la page"  et "Nombre de requêtes"  portent  sur toute la page en cours (qui reste la même tout au long du parcours) et pas sur les ressources ajoutées entre l'analyse en cours et l'analyse précédente.Pour remédier à ce problème, deux solutions possibles :
 * Après chaque analyse intermédiaire vider les requêtes tracées par le navigateur via le panneau réseau (ou Network) du panel développeur. L'analyse suivante ne prendra en compte que les nouvelles ressources téléchargées. 
 * Faire une seule analyse à la fin du parcours sur l'application single page (du fait de la structure mono page , l'analyse prendra en compte toutes les requêtes et données echangées lors du parcours) .  

### Particularités liées à Firefox ESR

Si vous utilisez l'extension sur firefox ESR: 
* vous devez aller dans l'onglet réseau lorsque vous avez ouvert le panel développeur(F12) avant d'aller sur la page à analyser (cela permet d'activer l'analyse des flux au sein du navigateur).
* il peut arriver que  la taille du dom soit à 0, vous devez dans ce cas fermer le panel developpeur et recommencer. 

### Particularité lié à Chrome

Si vous utilisez l'extension avec chrome et que vous avez coché l'option "bloquer les cookies tiers", la fonction de sauvegarde de analyses ne pourra pas fonctionner (cf. https://github.com/cnumr/GreenIT-Analysis/issues/30)

### Permissions de l'extension 

Pour fonctionner, l'extension utilise les permissions suivantes : 
* storage : utilisée pour stocker le résultat des analyses 
* activeTab, tabs : utilisée pour afficher la page des analyses sauvegardées et pour accéder aux contenus des pages pour l'analyse 
* <all_urls> : utilisée pour accéder aux Urls pour l'analyse

## Tests
Pour utiliser directement l'extension avec les modifications effectuées localement :   
* Aller dans les paramètres de Chrome > Plus d'outils > Extensions. Activer le Mode Développeur. 
* Cliquer sur "Chargez l'extension non empaquetée" et sélectionner le dossier où se trouve le code source. 


### Tests unitaires
Pour lancer les tests, il suffit d'ouvrir le fichier SpecRunner.html avec Chrome.   
Pour éviter un problème de CORS, lancer Chrome en désactivant la sécurité :   

```
google-chrome --disable-web-security --user-data-dir
```

### Tests manuels
Ouvrir dans Google Chrome les pages test1.html, test2.html et test3.html situées dans le répertoire tests/Manual/.
Lancer l'outil d'analyse pour chaque page et vérifier que les résultats correspondent à ce qui est indiqué sur la page.   

### Questions & anomalies
Pour toutes anomalies ou questions, vous pouvez poster une issue ou contacter didierfred@gmail.com 


## License

GreenIT-Analysis est sous license AGPLv3.

    Copyright (C) 2016  The EcoMeter authors (https://gitlab.com/ecoconceptionweb/ecometer)
    Copyright (C) 2019  didierfred@gmail.com 

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU Affero General Public License as published
    by the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Affero General Public License for more details.

    You should have received a copy of the GNU Affero General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.

Le texte complet de la license se trouve dans le fichier `LICENSE`.

Une partie du code provient du projet [EcoMeter](https://gitlab.com/ecoconceptionweb/ecometer).