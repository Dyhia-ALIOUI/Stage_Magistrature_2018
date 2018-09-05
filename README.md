# But de Stage:

Creation d'une base de données juridique pour les magistrats.


Le stage est basé essentiellement sur le site de [Legifrance](https://www.legifrance.gouv.fr/), ainsi que [La base XML]( https://www.steinertriples.fr/ncohen/data/nominations_JORF/) pour une comparaison ultérieure avec les résultats obtenus 

## Le stage est divisé en deux parties :
 
### *Recherche Manuelle* :

Dans cette partie on a cherché manuellement des magistrats (4), on a étudié leur carrière pour extraire tous les articles dont ils figurent. A partir de ceci, on a découvert des types d'articles qui se répètent pour tous les magistrats recherchés.

- Décrets portant nomination magistrature.

- Tableaux d'avancement (magistrature).

- Disposition.

Ces articles vont être les documents sur lesquels nous essayons la recherche automatique.


### *Recherche Automatique* :
  

Dans cette partie on a passé à l'automatisation en 2 étapes :


 1. **Crawling** 
 
 Le but de cette étape est d'extraire du site Légifrance les articles metionnés dans la partie ci-dessus. Plusieurs technologies ont été expérimentées avant de trouver une solution viable :
 
 - Ajax :warning: : première méthode utilisée, elle permet d'effectuer des requêtes entre serveurs, mais nous avons constaté que cette technique est soumise à de fortes contraintes de sécurité pour empêcher d'exploiter les sites. Devant la difficultée de contourner cette sécurité, il a été préférable de se pencher vers une nouvelle solution.
 
 - request / request-promise : ce sont deux librairies javascript pour effectuer des requêtes http côté serveur. La librairie request a été testée en premier mais il restait encore un problème lié au mécanisme asynchrone de javascript réglé avec le système de promesse implémenté dans le module request-promise.
 
 A l'issue de cette étape il reste néanmoins un dernier bug. En effet, les requêtes http sont soumises à un délai d'expiration qui n'est pas pratique pour une application de crawling, le problème n'est pas résolu, mais il est mineur car il peut être contourné simplement en lançant les requêtes plusieurs fois. De nouveaux documents seront téléchargés à chaque essai.
 
 1126 / 1191 décrets portant nomination magistrature ont été téléchargé avec succès à l'aide de l'application glitch.
 
 2. **Scraping** 
     
 - Un premier scraping est effectué pendant le crawling, à l'aide de la librairie cheerio, afin de récupérer toutes les informations nécessaires sur les pages afin de télécharger de manière convenable les fichiers. (Récupération des titres, du nombre d'articles)
 
 - Un deuxième scraping, le plus important, doit être effectué sur les documents téléchargés pour récupérer toutes les informations jugées pertinentes concernant à la carrière des magistrats. Deux approches sont étudiées pour extraire les informations cherchées, NLP et les expressions régulières.

**Naturel Language Processing** c'est une boîte à outils basée sur l'apprentissage automatique pour le traitement du texte en langage naturel

## IDE utilisé :

- [Glitch](https://glitch.com) :flags:

## Dépot Projet :

- [Github](https://github.com/) :octocat:
