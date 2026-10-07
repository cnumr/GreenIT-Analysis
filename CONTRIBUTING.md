# Contribuer à GreenIT-Analysis

Tout d'abord, merci d'envisager de contribuer à GreenIT-Analysis ! C'est grâce à des contributeurs comme vous que cette extension devient un outil toujours plus précieux pour quantifier les impacts environnementaux du web.

GreenIT-Analysis est un projet open source et nous accueillons avec plaisir les contributions de notre communauté. Il existe de nombreuses façons de contribuer : amélioration de la documentation, signalement de bugs et demandes de fonctionnalités, ou encore développement de code qui pourra être intégré à GreenIT-Analysis.

En suivant ces directives, vous montrez que vous respectez le temps des développeurs qui gèrent et développent ce projet open source. En retour, nous nous engageons à vous traiter avec le même respect dans la gestion de vos problèmes, l'évaluation de vos changements et l'aide à la finalisation de vos pull requests.

## Règles de base

### Responsabilités

* Être accueillant envers les nouveaux contributeurs et encourager la diversité.
* Créer des issues pour tout changement majeur ou amélioration que vous souhaitez apporter. Discuter de manière transparente et obtenir des retours de la communauté.
* Assurer la compatibilité multi-navigateurs pour chaque modification acceptée : Chrome, Firefox et autres navigateurs basés sur Chromium.
* Respecter le style de code et les patterns existants dans le projet.
* S'assurer que tout nouveau code passe la compilation TypeScript et les tests existants.
* Écrire des tests pour les nouvelles fonctionnalités et les corrections de bugs.

### Code de conduite

Ce projet adhère à un code de conduite. En participant, vous êtes tenu de respecter ce code. Veuillez être respectueux, attentif et inclusif dans toutes vos interactions avec la communauté du projet.

## Votre première contribution

Vous ne savez pas par où commencer pour contribuer à GreenIT-Analysis ? Commencez par consulter ces types d'issues :

* **Bonnes premières issues** - des problèmes qui ne nécessitent que quelques lignes de code et un ou deux tests.
* **Issues nécessitant de l'aide** - des problèmes un peu plus complexes que les issues pour débutants.
* **Rapports de bugs** - des bugs confirmés qui doivent être corrigés.
* **Demandes de fonctionnalités** - de nouvelles fonctionnalités demandées par la communauté.

Vous travaillez sur votre première Pull Request ? Vous pouvez apprendre comment faire grâce à cette série gratuite : [Comment contribuer à un projet open source sur GitHub](https://egghead.io/courses/how-to-contribute-to-an-open-source-project-on-github) (en anglais).

À ce stade, vous êtes prêt à apporter vos modifications ! N'hésitez pas à demander de l'aide ; tout le monde a été débutant un jour.

Si un mainteneur vous demande de "rebaser" votre PR, cela signifie que beaucoup de code a changé et que vous devez mettre à jour votre branche pour faciliter la fusion.

## Pour commencer

### Prérequis

Avant de commencer, assurez-vous d'avoir installé les éléments suivants :

- [Mise](https://mise.jdx.dev/) - gestionnaire de versions, de dépendances et de tâches (gère Node.js et pnpm automatiquement)
- [Git](https://git-scm.com/)

### Configuration du développement local

1. **Forker le dépôt**
   
   Créez votre propre fork de GreenIT-Analysis sur GitHub.

2. **Cloner votre fork**
   
   ```bash
   git clone https://github.com/cnumr/GreenIT-Analysis.git
   cd GreenIT-Analysis
   ```

3. **Charger l'extension dans votre navigateur**
   
   - **Chrome/Chromium** : Allez dans `chrome://extensions/`, activez le "Mode Développeur", puis cliquez sur "Charger l'extension non empaquetée" et sélectionnez le dossier où se trouve le code source.
   - **Firefox** : Allez dans `about:debugging#/runtime/this-firefox`, cliquez sur "Charger un module complémentaire temporaire", et sélectionnez le fichier `manifestV2.json`.

### Structure du projet

```
_locales/                                 # Fichiers de traduction (en, fr)
css/                                      # Feuilles de style
fonts/                                    # Polices de caractères
icons/                                    # Icônes et images
scripts/
├── analyseFrame.js                       # Point d'entrée pour l'analyse de frame
└── analyseFrameWithBestPractices.js
tests/                                    # Fichiers de test
background.js                             # Service worker en arrière-plan
GreenIT-Analysis.html                     # Point d'entrée DevTools
GreenPanel.html                           # Composants du panneau DevTools
history.html                              # Page historique
menu.html                                 # Point d'entrée du popup
```

## Tests

### Tests unitaires

Pour lancer les tests, il suffit d'ouvrir le fichier SpecRunner.html avec Chrome.  
Pour éviter un problème de CORS, lancer Chrome en désactivant la sécurité :

```
google-chrome --disable-web-security --user-data-dir
```

### Tests manuels

Ouvrir dans Google Chrome les pages test1.html, test2.html et test3.html situées dans le répertoire tests/Manual/.
Lancer l'outil d'analyse pour chaque page et vérifier que les résultats correspondent à ce qui est indiqué sur la page.

## Processus de revue de code

L'équipe principale examine les Pull Requests régulièrement. Après avoir reçu des retours, nous attendons une réponse sous deux semaines. Après deux semaines sans activité, nous pouvons fermer la pull request.

### Avant de soumettre une Pull Request

1. **Ajoutez des tests** pour les nouvelles fonctionnalités ou corrections de bugs.
2. **Suivez le style de code** - respectez la mise en forme, les conventions de nommage et les patterns existants.
3. **Mettez à jour la documentation** si vos changements affectent l'interaction des utilisateurs avec l'extension.
4. **Utilisez des messages de commit descriptifs**.

### Directives pour les Pull Requests

- Utilisez un titre clair et descriptif pour votre PR
- Incluez une description qui explique l'objectif et la portée de vos changements
- Référencez les issues liées en utilisant la syntaxe `#numéro-issue`

## Comment signaler un bug

Si vous trouvez une vulnérabilité de sécurité, **ne pas** ouvrir d'issue. Contactez plutôt les mainteneurs de manière privée.

Lors du signalement d'un bug, assurez-vous d'inclure les informations suivantes :

1. **Navigateur et version** (Chrome, Firefox, etc.)
2. **Système d'exploitation** (Windows, macOS, Linux)
3. **Version de l'extension**
4. **Étapes pour reproduire** le problème
5. **Comportement attendu** - ce que vous attendiez
6. **Comportement réel** - ce qui s'est réellement produit
7. **Captures d'écran ou messages d'erreur** (si applicable)
8. **URL de la page** où le problème s'est produit (si applicable)

### Modèle de rapport de bug

```markdown
## Description

[Description claire et concise du bug]

## Environnement
- Navigateur : [ex. Chrome 120]
- OS : [ex. Windows 11]
- Version de l'extension : [ex. 3.2.0]

## Étapes pour reproduire
1. Aller sur '...'
2. Cliquer sur '...'
3. Faire défiler jusqu'à '...'
4. Voir l'erreur

## Comportement attendu
[Description claire de ce que vous attendiez]

## Comportement réel
[Description claire de ce qui s'est réellement produit]

## Contexte supplémentaire
[Ajoutez tout autre contexte concernant le problème ici]
```

## Comment suggérer une fonctionnalité

Si vous avez une idée pour une nouvelle fonctionnalité ou amélioration, veuillez :

1. **Vérifier les issues existantes** pour voir si elle a déjà été suggérée
2. **Ouvrir une nouvelle issue** avec les informations suivantes :
   - Une description claire de la fonctionnalité
   - Le problème qu'elle résout ou la valeur qu'elle apporte
   - Comment elle devrait fonctionner du point de vue de l'utilisateur
   - Toute considération technique ou idée d'implémentation

### Modèle de demande de fonctionnalité

```markdown
## Demande de fonctionnalité

### Votre demande de fonctionnalité est-elle liée à un problème ?
[Description claire et concise du problème]

### Décrivez la solution que vous aimeriez
[Description claire de ce que vous voulez voir se produire]

### Décrivez les alternatives que vous avez considérées
[Description claire de toute solution ou fonctionnalité alternative que vous avez considérée]

## Contexte supplémentaire
[Ajoutez tout autre contexte ou capture d'écran concernant la demande ici]
```

## Conventions de code, commits et étiquetage

### Style de code

- Utilisez des noms de variables et fonctions significatifs
- Gardez les fonctions petites et ciblées
- Ajoutez des commentaires JSDoc pour les fonctions complexes

## Notes supplémentaires

### Travailler avec les traductions

GreenIT-Analysis supporte plusieurs langues. Les fichiers de traduction se trouvent dans `_locales/` :

- Anglais : `_locales/en/messages.json`
- Français : `_locales/fr/messages.json`

Lorsque vous ajoutez un nouveau texte dans l'UI, veuillez mettre à jour tous les fichiers de traduction en conséquence.

### Protection des branches

La branche `master` est protégée. Toutes les modifications doivent être soumises via des pull requests et doivent passer toutes les vérifications CI avant d'être mergées.

## Communauté

Vous pouvez contacter la communauté et les mainteneurs via :

- **Issues GitHub** : Pour les rapports de bugs et demandes de fonctionnalitéss
- **Email** : Pour les questions privées (voir le README pour les informations de contact)
