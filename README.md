# GreenIT-Analysis 
Cette application est basée sur l'extension Chrome GreenIT-Analysis (https://github.com/cnumr/GreenIT-Analysis).

# Sommaire
- [Principe de l'outil](#principe-de-loutil)
- [Utiliser l'outil](#utiliser-loutil)
  - [Node.js](#nodejs)
    - [Prérequis](#prérequis)
    - [Installation](#installation)
  - [Docker](#docker)
    - [Prérequis](#prérequis-1)
    - [Utilisation](#utilisation)
- [Commandes](#commandes)
  - [`analyse [yaml_input_file] [xlsx_output_file]`](#analyse-yaml_input_file-xlsx_output_file)
    - [Flags](#flags)
  - [`parseSitemap <sitemap_url> [yaml_output_file]`](#parsesitemap-sitemap_url-yaml_output_file)
  - [Flags généraux](#flags-généraux)
- [Usage](#usage)

# Principe de l'outil
Cet outil simule l'exécution de l'extension sur les pages spécifiées ouvertes dans Chromium en passant par Puppeteer pour récuperer les résultats.

# Utiliser l'outil
Pour utiliser l'outil, un fichier YAML listant toutes les URL à analyser est nécéssaire.
```yaml
- https://collectif.greenit.fr/
- https://collectif.greenit.fr/outils.html
```

## Node.js

### Prérequis
 - Node.js

### Installation 
1. `npm install`
2. `npm link`
3. `greenit <command>`

## Docker

### Prérequis
 - Docker
 - Le fichier YAML nommée "url.yaml" à la racine du projet.

### Utilisation
1. `docker build -t imageName .`
2. Lancement du cli :
    - Pour tester sans récupperer les résultats : `docker run -it --init --rm --cap-add=SYS_ADMIN --name containerName imageName`
    - Pour récupérer les résultats :
        1. `docker volume create volumeName`
        2. `docker run -it -v volumeName:/app/results --init --rm --cap-add=SYS_ADMIN --name containerName imageName`
        3. `docker volume inspect volumeName` pour récupérer le chemin vers les fichiers créés

# Commandes

## `analyse [yaml_input_file] [xlsx_output_file]`

- `yaml_input_file` : Chemin vers le fichier YAML listant toutes les URL à analyser. (Valeur par défaut : "url.yaml")
- `xlsx_output_file` : Chemin pour le fichier de sortie. (Valeur par défaut : "results.xlsx")

### Flags

- `--timeout , -t` : Nombre de millisecondes maximal pour charger une url. (Valeur par défaut : 180000)
- `--max_tab` : Nombre d'URL analysées en "simultané" (asynchronicité). (Valeur par défaut : 40)
- `--retry , -r` : Nombre d'essais supplémentaires d'analyse en cas d'echec. (Valeur par défaut : 2)
- `--worst_pages` : Nombre de pages à traiter en priorité affichées sur la page de résumé. (Valeur par défaut : 5)
- `--worst_rules` : Nombre de règles à respecter en priorité affichées sur la page de résumé. (Valeur par défaut : 5)
- `--login , -l` : Chemin vers le fichier YAML contenant les informations de connexions.

  Exemple de login.yaml :
  ```yaml
  url: "https://url/login"
  fields:
    - selector: '#usernameFieldId'
      value: username
    - selector: '#passwordFieldId'
      value: password
  loginButtonSelector: '#loginButtonId'
  ```
  Plus d'informations sur les selectors : https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Selectors

- `--device , -d` : Emulation du terminal d'affichage. (Valeur par défaut : "desktop")
  
  Choix:
  - desktop
  - galaxyS9
  - galaxyS20
  - iPhone8
  - iPhone8Plus
  - iPhoneX
  - iPad
## `parseSitemap <sitemap_url> [yaml_output_file]`

- `sitemap_url` : URL de la sitemap à transformer.
- `yaml_output_file` : Chemin pour le fichier de sortie. (Valeur par défaut : "url.yaml")

## Flags généraux

- `--ci` : Log de façon traditionnelle pour assurer la compatibilité avec les environements CI.

# Usage

Cet outil fait appel à une API ne permettant pas son utilisation à des fins commerciales.