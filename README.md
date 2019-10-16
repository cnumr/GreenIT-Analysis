# GreenIT-Analysis 

Extension pour Google Chrome & Chromium   
Pour l'instant, certaines API utilisées ne sont pas prises en charge par Firefox. 

Cette extension a pour vocation de reprendre les fonctionnalités de [EcoIndex](http://www.ecoindex.fr/) et [EcoMeter](http://www.ecometer.org/).

L'outil vous permet de quantifier les impacts environnementaux d'un parcours utilisateur complet, même derrière un firewall et / ou une authentification applicative. Il vérifie également l'utilisation de bonnes pratiques visant à diminuer ces impacts.


### Utiliser l'extension
* Ouvrir les outils de développement de Google Chrome (F12).   
* Aller dans l'onglet GreenIT.   
* Dans le navigateur, aller sur la page à analyser.
* Dans l'onglet GreenIT des outils de développement, cliquer sur le bouton "Launch Analysis".
* Les résultats s'affichent.
* Vous pouvez sauvegarder ce résultat dans un historique (seul les indicateurs sont enregistrés) via le bouton "Save Analysis"
* L'historique des résultats sauvegardés est disponible via le bouton "View History"

Pour avoir une analyse des bonnes pratiques, il faut cocher la case "Activate best practices analysis".


Quelques points de vigilance: 

* Si le nombre de requêtes est à zéro, c'est probablement parce que vous n'avez pas charger la page avec les outils de developpement démarrés. Il faut donc penser à faire un rechargement de la page.
* Pour avoir des mesures correctes, il faut préalablement vider le cache du navigateur (Dans le cas contraire, le volume transféré va être réduit si vous avez déjà consulté le site mesuré).
* L'utilisation d'un bloqueur de publicité ou autre filtre a une influence sur le résultat.

### Enregistrement du parcours utilisateur

Vous pouvez quantifier les impacts environnementaux d'un parcours utilisateur en lançant et en enregistrant des analyses sucessives après chaque page visitée. 

 Attention cependant car le plugin ne vous permet pas d'enregistrer simplement un parcours utilisateur dans le cas d'une application monopage (Single Page Application). En effet lorsque vous cliquez sur analyse, les valeurs  "Taille de la page"  et "Nombre de requêtes"  portent  sur toute la page en cours (qui reste la même tout au long du parcours) et pas sur les ressources ajoutées entre l'analyse en cours et l'analyse précédente.Pour remédier à ce problème, deux solutions possibles :
 * Après chaque analyse intermédiaire vider les requêtes tracées par le navigateur via le panneau réseau (ou Network) du panel développeur. L'analyse suivante ne prendra en compte que les nouvelles ressources téléchargées. 
 * Faire une seule analyse à la fin du parcours sur l'application single page (du fait de la structure mono page , l'analyse prendra en compte toutes les requêtes et données echangées lors du parcours) . 


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
Ouvrir dans Google Chrome la page tests/Manual/test.html.   
Lancer l'outil d'analyse et vérifier que les résultats correspondent à ce qui est indiqué sur la page.   


