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

3. **Installer les dépendances**
   
   Ce projet utilise **Mise** pour gérer les versions de Node.js et pnpm :
   
   ```bash
   mise install
   ```
   
   Cela installera toutes les dépendances et exécutera le script postinstall qui prépare l'environnement WXT.

4. **Mode développement**
   
   Pour exécuter l'extension en mode développement :
   
   ```bash
   mise dev
   ```
   
   Cela démarrera le serveur de développement WXT. Vous pouvez aussi cibler spécifiquement Firefox :
   
   ```bash
   mise dev:firefox
   ```

5. **Charger l'extension dans votre navigateur**
   
   - **Chrome/Chromium** : Allez dans `chrome://extensions/`, activez le "Mode Développeur", puis cliquez sur "Charger l'extension non empaquetée" et sélectionnez le dossier `.output/chrome-mv3`.
   - **Firefox** : Allez dans `about:debugging#/runtime/this-firefox`, cliquez sur "Charger un module complémentaire temporaire", et sélectionnez le fichier `manifest.json` du dossier `.output/firefox-mv2`.

### Structure du projet

Le projet utilise le framework **WXT (Web Extension Toolkit)** et suit une structure modulaire :

```
greenit-analysis/
├── assets/                               # 
├── entrypoints/                          # Points d'entrée pour les différents composants de l'extension
│   ├── analyseFrame.js                   # Point d'entrée pour l'analyse de frame
│   ├── analyseFrameWithBestPractices.js  
│   ├── background.js                     # Service worker en arrière-plan
│   ├── devtools-panel/                   # Composants du panneau DevTools
│   ├── devtools/                         # Point d'entrée DevTools
│   ├── histo/                            # Page historique
│   └── popup/                            # Point d'entrée du popup
├── public/                               # Ressources statiques
│   ├── _locales/                         # Fichiers de traduction (en, fr)
│   ├── css/                              # Feuilles de style
│   ├── fonts/                            # Polices de caractères
│   └── icons/                            # Icônes et images
├── tests/                                # Fichiers de test
│   ├── e2e/                              # Tests end-to-end (Playwright)
│   └── unit/                             # Tests unitaires (Vitest)
├── wxt.config.ts                         # Configuration WXT
└── package.json                          # Dépendances et scripts du projet
```

### Compiler l'extension

Pour compiler l'extension pour la production :

```bash
# Pour Chrome/Chromium
mise build

# Pour Firefox
mise build:firefox
```

L'extension compilée sera disponible dans le dossier `.output/`.

### Packager l'extension

Pour créer un fichier zip pour la distribution :

```bash
# Pour Chrome/Chromium
mise zip

# Pour Firefox
mise zip:firefox
```

## Tests

### Compilation TypeScript

Pour vérifier que votre code se compile sans erreurs :

```bash
mise compile
```

### Tests unitaires

Ce projet utilise [Vitest](https://vitest.dev/) pour les tests unitaires :

```bash
mise test:unit
```

Ou pour exécuter les tests en mode surveillance :

```bash
mise test:unit --watch
```

### Tests end-to-end

Ce projet utilise [Playwright](https://playwright.dev/) pour les tests end-to-end :

```bash
# Exécuter les tests e2e (installe automatiquement les navigateurs et compile l'extension)
mise test:e2e
```

### Emplacement des fichiers de test

- Tests unitaires : `tests/unit/*.spec.js`
- Tests e2e : `tests/e2e/*.test.ts`

Chaque règle et fonction utilitaire doit avoir des tests unitaires correspondants.

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
- Assurez-vous que toutes les vérifications CI passent (compilation TypeScript, tests, build)

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

- Utilisez TypeScript pour tout nouveau code
- Suivez les patterns et conventions de code existants
- Utilisez des noms de variables et fonctions significatifs
- Gardez les fonctions petites et ciblées
- Ajoutez des commentaires JSDoc pour les fonctions complexes
- Préférez la syntaxe ES6+ (fonctions fléchées, const/let, littéraux de template, etc.)

### Directives TypeScript

- Utilisez un typage fort lorsque c'est possible
- Préférez les interfaces pour les formes d'objets
- Utilisez des alias de types pour les types complexes
- Marquez les propriétés optionnelles avec `?`
- Utilisez les types union pour plusieurs types possibles

## Notes supplémentaires

### Travailler avec les traductions

GreenIT-Analysis supporte plusieurs langues. Les fichiers de traduction se trouvent dans `public/_locales/` :

- Anglais : `public/_locales/en/messages.json`
- Français : `public/_locales/fr/messages.json`

Lorsque vous ajoutez un nouveau texte dans l'UI, veuillez mettre à jour tous les fichiers de traduction en conséquence.

### Protection des branches

La branche `master` est protégée. Toutes les modifications doivent être soumises via des pull requests et doivent passer toutes les vérifications CI avant d'être mergées.

## Communauté

Vous pouvez contacter la communauté et les mainteneurs via :

- **Issues GitHub** : Pour les rapports de bugs et demandes de fonctionnalitéss
- **Email** : Pour les questions privées (voir le README pour les informations de contact)
