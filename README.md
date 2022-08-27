# GreenIT-Analysis (V3.0.1)


GreenIT-Analysis est une extension pour navigateur qui vous permet de quantifier les impacts environnementaux d'un parcours utilisateur complet, même derrière un firewall et / ou une authentification applicative. L'outil vérifie également l'utilisation de bonnes pratiques visant à diminuer ces impacts.

Cette extension s'inspire fortement des fonctionnalités de [EcoIndex](http://www.ecoindex.fr/) et [EcoMeter](http://www.ecometer.org/).

Pour les informations concernant le calcul de l'ecoindex, se référer à  http://ecoindex.fr/quest-ce-que-ecoindex/.

L'extension est supportée sur toutes les versions de navigateurs basés sur chromium (à partir de la version 55 ). Elle est aussi supportée sur firefox avec quelques bonnes pratiques non supportées (du fait de limitations des API Firefox). 
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
* Pour avoir des mesures correctes, il faut préalablement vider le cache du navigateur (Dans le cas contraire, le volume transféré va être réduit si vous avez déjà consulté le site mesuré). Pour vous eviter d'aller dans les menus du navigateur, un bouton est prévu à cet effet dans l'extension. 
* L'utilisation d'un bloqueur de publicité ou autre filtre a une influence sur le résultat.


### Résultats différents entre deux analyses 

Le plugin effectue son analyse sur la base des données fournies par l'API du navigateur et, ce faisant, témoigne de la réalité constatée au moment de l'analyse dans le navigateur qui l'exécute. Lorsque l'on fait deux fois l'analyse d'un même site, le résultat peut être différent. Parmi les causes possibles, on notera par exemple:
- les  mécanismes de mise à jour en continu  (même si vous avez l'impression que le site est chargé, il y a des choses qui peuvent continuer à se charger et au moment où vous lancez l'analyse il y a toujours des chargements en cours, le volume de données téléchargé et le nombre de requêtes dépendent donc du moment ou vous cliquez sur le bouton "analyser"). De même, si vous lancez l'analyse alors que le site n'est pas totalement chargé vous aurez aussi cet effet.
- les publicités qui peuvent changer entre deux analyses (la localisation, l'heure de la journée, visites précédentes avec son navigateur et bien d'autres paramètres qui sont pris en compte par les spécialistes du retargeting vont se traduire par le chargement en cascade de librairies *.js différentes et de l'affichage de contenus publicitaires différents)
- le scrolling : si on fait un scrolling au moment de l'analyse, on risque de lancer des chargements de données qui ne seraient pas fait sinon.
- Le niveau de "privacy" qui, selon le niveau paramétré et selon le navigateur, induira lui aussi des effets de bord
- Les effets de cache (cf. point de vigilance du chapitre précédent)

### Enregistrement du parcours utilisateur

Vous pouvez quantifier les impacts environnementaux d'un parcours utilisateur en lançant et en enregistrant des analyses sucessives après chaque page visitée. On pourra calculer une ecoIndex global sur la base d'une moyenne :  ( score url1 + score url2 + score url3 + ... score urln ) / n

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
* activeTab, tabs : utilisée pour afficher la page des analyses sauvegardées et pour accéder aux contenus des pages pour l'analyse 
* <all_urls> : utilisée pour accéder aux Urls pour l'analyse
* browsingData : utilisée pour vider le cache du navigateur

### Confidentialité 

L'analyse est effectuée en local et le résulat est stocké dans l'espace de stockage du navigateur lorsque l'utilisateur choisit d'enregister l'analyse. Le plugin ne fait aucune connexion réseau et donc aucune donnée n'est envoyé sur le réseau. 

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

    Copyright (C) 2015 EcoIndex.fr, Frédéric Bordage, (http://ecoindex.fr/quest-ce-que-ecoindex/)
    Copyright (C) 2016-2022 Frédéric Bordage
    Copyright (C) 2016  The EcoMeter authors (https://gitlab.com/ecoconceptionweb/ecometer)
    Copyright (C) 2019-2022  didierfred@gmail.com 

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


Les facteurs d'impacts environnementaux (quantités de gaz à effet de serre et d'eau) ne sont pas sous licence libre. Tous droits réservés.  © Frédéric Bordage. Merci de demander l'autorisation à son auteur pour les utiliser : fbordage@greenit.fr .


Une partie du code provient du projet [EcoMeter](https://gitlab.com/ecoconceptionweb/ecometer).
