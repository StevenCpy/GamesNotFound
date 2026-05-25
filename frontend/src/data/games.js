let games_str = '{' +
    '"games":[' +
        '{"Id":"1","gameName":"Happy Birds","gameVersion":"1.0.0","author":"Riovo"},' +
        '{"Id":"2","gameName":"GTA IX","gameVersion":"1.0.0","author":"RockNRoll Star"},' +
        '{"Id":"3","gameName":"Mario Bruhs","gameVersion":"1.0.0","author":"Nindento"}' +
    ']' +
'}'

const games = JSON.parse(games_str)

export default games