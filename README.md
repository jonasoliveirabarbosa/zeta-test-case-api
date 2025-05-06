## Next.js Store API with PostgreSQL

A geospatial API for store locations built with Next.js and PostgreSQL. Features powerful location-based filtering and sorting capabilities for retail applications.

### Store Information
This API provides comprehensive data about physical store locations including:

- Store names and addresses

- Business categories (status hierarchy N1-N4)

- Operational status (active/ended)

- Location coordinates (latitude/longitude)

- Store images

- Custom tags with status labels and color coding

- Visit status tracking

## API Response Example

``` json
GET /api/stores?lat=-22.9068&lng=-43.1729&radius=10

{
    "limit": 30,
    "page": 0,
    "pageSize": 0,
    "sort": "",
    "data": [
        {
            "id": 1091,
            "storeName": "-",
            "address": "exemplo - Bairro - Cidade - UF",
            "status": "Tradicional",
            "statusN2": "Exemplo2",
            "statusN3": "Exemplo3",
            "statusN4": "Exemplo5",
            "imgUrl": "https://streetviewpixels-pa.googleapis.com/v1/thumbnail?panoid=FvvgvgI5QgnKeRYVsvx6sQ&cb_client=search.gws-prod.gps&w=408&h=240&yaw=173.81546&pitch=0&thumbfov=100",
            "lat": -22.87295,
            "lng": -43.11471,
            "onGoing": false,
            "ended": false,
            "tags": [
              ...
            ],
            "hasClient": false,
            "distance": 10
        },
        ...
    ],
    "total": 3656
}
```

## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```
