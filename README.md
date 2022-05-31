# Normantle frontend

Frontenden for prosjektet [Normantle](https://normantle.lblend.moe).

For mer informasjon angående prosjektet se [backendrepoet](https://github.com/LBlend/normantle)


## Kom i gang

<details>

<summary>Manuell installasjon (developer mode)</summary>

0. Klon repoet og last ned avhengighetene:

   - node.js
   - yarn

1. Installer prosjektavhengighetene

```
yarn install
```

2. Lag en kopi av filen [env.example](env.example) og gi den navnet `.env`. Bytt så ut URLen med en som peker mot din egen backend

3. Kjør webappen

```
yarn dev
```

</details>

<details>

<summary>Docker (deployment)</summary>

### Valgmulighet 1 - Bruke forhåndsbygget versjon

1. Skriv denne kommandoen for å kjøre webappen.

```
docker run -d -p 3000:3000 --name normantle-frontend ghcr.io/lblend/normantle-frontend:latest
```

Her kan du så klart endre på variabler som du ønsker.

### Valgmulighet 2 - Bygge et dockerbilde på egenhånd

1. Klon repoet

2. Gå inn i [Dockerfila](Dockerfile) og endre på `API_ROOT` til å peke mot din backend.

3. Bygg dockerbildet

```
docker build -t normantle-frontend .
```

4. Lag og kjør en dockercontainer

```
docker run -d -p 3000:3000 --name normantle-frontend normantle-frontend
```

Merk deg her at om du har valgt å endre port i dockerfila, så bør det reflekteres her.

</details>
