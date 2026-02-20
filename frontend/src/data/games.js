let games_str = '{' +
    '"games":[' +
        '{"Id":"1","gameName":"Happy Birds","gameVersion":"1.0.0","author":"Riovo","coverImageName":"happy-birds.jpg"},' +
        '{"Id":"2","gameName":"GTA IX","gameVersion":"1.0.0","author":"RockNRoll Star","coverImageName":"gta-ix.jpg"},' +
        '{"Id":"3","gameName":"Mario Bruhs","gameVersion":"1.0.0","author":"Nindento","coverImageName":"mario-bruhs.jpg"}' +
    ']' +
'}'

const games = JSON.parse(games_str)

export default games