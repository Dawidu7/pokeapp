## Tables

- [ ] Pokémon Species
- [ ] Pokémon
- [ ] Types
- [ ] Moves
- [ ] PokémonTypes
- [ ] PokémonMoves
- [ ] Type Effectiveness

# Order

## Types

From:

```json
{
  "id": 1,
  "name": "normal",
  "damage_relations": {
    "no_damage_to": [
      {
        "name": "ghost",
        "url": "https://pokeapi.co/api/v2/type/8/"
      }
    ],
    "half_damage_to": [
      {
        "name": "rock",
        "url": "https://pokeapi.co/api/v2/type/6/"
      },
      {
        "name": "steel",
        "url": "https://pokeapi.co/api/v2/type/9/"
      }
    ],
    "double_damage_to": [],
    "no_damage_from": [
      {
        "name": "ghost",
        "url": "https://pokeapi.co/api/v2/type/8/"
      }
    ],
    "half_damage_from": [],
    "double_damage_from": [
      {
        "name": "fighting",
        "url": "https://pokeapi.co/api/v2/type/2/"
      }
    ]
  },
  "names": [
    {
      "name": "Normal",
      "language": {
        "name": "en",
        "url": "https://pokeapi.co/api/v2/language/9/"
      }
    }
  ]
}
```

To:

```json
{
  "id": 1,
  "slug": "normal",
  "name": "Normal",
  "damageRelations": {
    "noDamageTo": [8],
    "halfDamageTo": [6, 9],
    "doubleDamageTo": [],
    "noDamageFrom": [8],
    "halfDamageFrom": [],
    "doubleDamageFrom": [2]
  }
}
```

## Moves

From:

```json
{
  "id": 1,
  "name": "pound",
  "accuracy": 100,
  "effect_chance": null,
  "pp": 35,
  "priority": 0,
  "power": 40,
  "damage_class": {
    "name": "physical",
    "url": "https://pokeapi.co/api/v2/move-damage-class/2/"
  },
  "effect_entries": [
    {
      "effect": "Inflicts regular damage.",
      "short_effect": "Inflicts regular damage with no additional effect.",
      "language": {
        "name": "en",
        "url": "https://pokeapi.co/api/v2/language/9/"
      }
    }
  ],
  "meta": {
    "ailment": {
      "name": "none",
      "url": "https://pokeapi.co/api/v2/move-ailment/0/"
    },
    "category": {
      "name": "damage",
      "url": "https://pokeapi.co/api/v2/move-category/0/"
    },
    "min_hits": null,
    "max_hits": null,
    "min_turns": null,
    "max_turns": null,
    "drain": 0,
    "healing": 0,
    "crit_rate": 0,
    "ailment_chance": 0,
    "flinch_chance": 0,
    "stat_chance": 0
  },
  "names": [
    {
      "name": "Pound",
      "language": {
        "name": "en",
        "url": "https://pokeapi.co/api/v2/language/9/"
      }
    }
  ],
  "target": {
    "name": "selected-pokemon",
    "url": "https://pokeapi.co/api/v2/move-target/10/"
  },
  "type": {
    "name": "normal",
    "url": "https://pokeapi.co/api/v2/type/1/"
  }
}
```

To:

```json
{
  "id": 1,
  "slug": "pound",
  "name": "Pound",
  "accuracy": 100,
  "pp": 35,
  "priority": 0,
  "power": 40,
  "damageClass": "physical",
  "effect": "Inflicts regular damage with no additional effect.",
  "ailment": null,
  "category": "damage",
  "minHits": null,
  "maxHits": null,
  "minTurns": null,
  "maxTurns": null,
  "drain": 0,
  "healing": 0,
  "critRate": 0,
  "ailmentChance": 0,
  "flinchChance": 0,
  "statChance": 0,
  "effectChance": null,
  "target": "selected-pokemon",
  "typeId": 1
}
```

## Pokémon

From:

```json
{
  "id": 1,
  "slug": "bulbasaur",
  "height": 7,
  "order": 1,
  "weight": 69,
  "forms": [
    {
      "name": "bulbasaur",
      "url": "https://pokeapi.co/api/v2/pokemon-form/1/"
    }
  ],
  "moves": [
    {
      "move": {
        "name": "razor-wind",
        "url": "https://pokeapi.co/api/v2/move/13/"
      },
      "version_group_details": [
        {
          "level_learned_at": 0,
          "version_group": {
            "name": "gold-silver",
            "url": "https://pokeapi.co/api/v2/version-group/3/"
          },
          "move_learn_method": {
            "name": "egg",
            "url": "https://pokeapi.co/api/v2/move-learn-method/2/"
          },
          "order": null
        },
        {
          "level_learned_at": 0,
          "version_group": {
            "name": "crystal",
            "url": "https://pokeapi.co/api/v2/version-group/4/"
          },
          "move_learn_method": {
            "name": "egg",
            "url": "https://pokeapi.co/api/v2/move-learn-method/2/"
          },
          "order": null
        }
      ]
    },
    ...
  ],
  "species": {
    "name": "bulbasaur",
    "url": "https://pokeapi.co/api/v2/pokemon-species/1/"
  },
  "stats": [
    {
      "base_stat": 45,
      "effort": 0,
      "stat": {
        "name": "hp",
        "url": "https://pokeapi.co/api/v2/stat/1/"
      }
    },
    {
      "base_stat": 49,
      "effort": 0,
      "stat": {
        "name": "attack",
        "url": "https://pokeapi.co/api/v2/stat/2/"
      }
    },
    {
      "base_stat": 49,
      "effort": 0,
      "stat": {
        "name": "defense",
        "url": "https://pokeapi.co/api/v2/stat/3/"
      }
    },
    {
      "base_stat": 65,
      "effort": 1,
      "stat": {
        "name": "special-attack",
        "url": "https://pokeapi.co/api/v2/stat/4/"
      }
    },
    {
      "base_stat": 65,
      "effort": 0,
      "stat": {
        "name": "special-defense",
        "url": "https://pokeapi.co/api/v2/stat/5/"
      }
    },
    {
      "base_stat": 45,
      "effort": 0,
      "stat": {
        "name": "speed",
        "url": "https://pokeapi.co/api/v2/stat/6/"
      }
    }
  ],
  "types": [
    {
      "slot": 1,
      "type": {
        "name": "grass",
        "url": "https://pokeapi.co/api/v2/type/12/"
      }
    },
    {
      "slot": 2,
      "type": {
        "name": "poison",
        "url": "https://pokeapi.co/api/v2/type/4/"
      }
    }
  ]
}
```

To:

```json
{
  "id": 1,
  "slug": "bulbasaur",
  "order": 1,
  "height": 0.7,
  "weight": 6.9,
  "formName": null,
  "moveIds": [13, ...],
  "speciesId": 1,
  "baseStats": {
    "hp": 45,
    "attack": 49,
    "defense": 49,
    "specialAttack": 65,
    "specialDefense": 65,
    "speed": 45
  },
  "types": [
    {
      "slot": 1,
      "typeId": 12
    },
    {
      "slot": 2,
      "typeId": 4
    }
  ]
}
```

## Pokémon Species

From:

```json
{
  "id": 1,
  "name": "bulbasaur",
  "order": 1,
  "generation": {
    "name": "generation-i",
    "url": "https://pokeapi.co/api/v2/generation/1/"
  },
  "names": [
    {
      "name": "Bulbasaur",
      "language": {
        "name": "en",
        "url": "https://pokeapi.co/api/v2/language/9/"
      }
    }
  ],
  "flavor_text_entries": [
    {
      "flavor_text": "A strange seed was\nplanted on its\nback at birth.\fThe plant sprouts\nand grows with\nthis POKéMON.",
      "language": {
        "name": "en",
        "url": "https://pokeapi.co/api/v2/language/9/"
      },
      "version": {
        "name": "red",
        "url": "https://pokeapi.co/api/v2/version/1/"
      }
    }
  ],
  "genera": [
    {
      "genus": "Seed Pokémon",
      "language": {
        "name": "en",
        "url": "https://pokeapi.co/api/v2/language/9/"
      }
    }
  ],
  "varieties": [
    {
      "is_default": true,
      "pokemon": {
        "name": "bulbasaur",
        "url": "https://pokeapi.co/api/v2/pokemon/1/"
      }
    }
  ]
}
```

To:

```json
{
  "id": 1,
  "slug": "bulbasaur",
  "order": 1,
  "generation": "generation-i",
  "name": "Bulbasaur",
  "flavorText": "A strange seed was planted on its back at birth. The plant sprouts and grows with this Pokémon.",
  "genus": "Seed Pokémon",
  "varieties": [
    {
      "pokemonId": 1,
      "isDefault": true
    }
  ]
}
```
