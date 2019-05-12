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


