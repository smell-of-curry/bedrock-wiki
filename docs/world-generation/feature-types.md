---
title: Feature Types
---

# Feature Types

*Last updated for 1.17.10*

::: warning
Some links designed to reference external documents do not function, and will be updated at a later time to point to the correct resource.

Screenshots and other resources may be provided for many feature types given here at a later time.
:::

## Content Features
Content features are the fundamental feature type responsible for defining block placements in a feature system. They offer nothing in terms of arrangement or composition. Instead, they define basic arrangements of blocks and are often combined or positioned using [proxy features](#proxy-features).

### Single Block Features
```json
{
	"format_version": "1.13.0",

	"minecraft:single_block_feature": {
		"description": {
			"identifier": "beachside:pier_planks"
		},

		"places_block": "minecraft:planks",

		"enforce_placement_rules": true,
		"enforce_survivability_rules": true,
		"may_replace": ["minecraft:water"],
		"may_attach_to": {
			"top": "minecraft:air",
			"sides": [
				"minecraft:planks",
				"minecraft:water"
			]
		}
	}
}
```

**Single block features** place a single block in the world. Single block features are typically useless on their own; their real power comes in conjunction with [proxy features](#proxy-features) to construct builds.

The **target block**, the block to be placed, is specified by the `"places_block"` property. No variation capabilities are currently possible in the definition; [weighted random features](#weighted-random-features) over additional single block features must be used instead.

#### Conditions
**Conditions** can be specified to limit placement success. If any of the conditions would fail, the block will not be placed.

##### Innate Block Conditions
Single block features can allow block placement that wouldn’t be allowed in-game due to a block’s innate conditions.

When true, the required `"enforce_placement_rules"` boolean ensures a block’s innate placement check must succeed for the block to be placed; setting to false ignores this check. As an example, seeds can usually only be placed on farmland, but disabling this check can allow them to generate anywhere.

Additionally, the required "enforce_survivability_rules" boolean property will toggle whether the survivability checks of a block will succeed. If false, the block’s survivability conditions are ignored. One vanilla survivability example is living coral blocks requiring adjacent water.

::: tip NOTE
Just because the block’s survivability check was ignored for world generation does not mean it will maintain its invalid state during gameplay. Block updates will correct invalid block survivability.
:::

##### Replacement Conditions
```json
"may_replace": [
	"minecraft:air",
	"minecraft:leaves",
	"minecraft:leaves2"
]
```

Single block features may optionally specify a **replacement list** via the `"may_replace"` array to restrict the set of blocks the target block may replace. If the block at the [input position](#) of the single block feature is *not* in this list, the placement will fail.

::: warning
Unlike [attachment properties](#attachment-conditions), `"may_replace"` must be an array. It cannot be declared as a direct block reference.
:::

##### Attachment Conditions
```json
"may_attach_to": {
	"top": "minecraft:air",
	"sides": [
		"minecraft:planks",
		"minecraft:water"
	]
}
```

**Attachment specifications**, given via the optional `"may_attach_to"` property, restrict block adjacency. A property exists for each attachable side:

- `"top"`
- `"bottom"`
- `"north"`
- `"south"`
- `"east"`
- `"west"`

Each property accepts either a single direct block reference or an array of such references:

```json
"bottom": {
	"name": "minecraft:stone",

	"states": {
		"stone_type": "andesite"
	}
}
```

```json
"top": [
	"minecraft:netherrack",
	"minecraft:soul_sand"
]
```

A `"sides"` property is available as a catch-all to match `"north"`, `"west"`, `"east"`, and `"south"`. Finally, the `"all"` property matches all 6 faces. All 8 properties are optional, but at least one should be specified.

For attachment along the sides (`"north"`, `"south"`, `"east"`, `"west"`), 2 more optional properties are available for fine control.

`"min_sides_must_attach"` sets the minimum number of successes yielded by provided side properties that will result in side attachment being flagged as successful. Therefore, if this property is set to `4`, all four sides must match. If set to `2` and only 1 side matched, block placement would fail.

`"auto_rotate"` causes side definitions to be interpreted as relative associations instead of strict directions. As an example, if a block should be squeezed laterally in one dimension between two other blocks but the orientation doesn’t matter, enabling auto rotate and specifying opposing sides would allow either orientation to work.

```json
{
	"format_version": "1.13.0",

	"minecraft:single_block_feature": {
		"description": {
			"identifier": "aura_heights:force_conduit_block"
		},

		"places_block": "aura_heights:force_conduit",

		"enforce_placement_rules": true,
		"enforce_survivability_rules": true,
		"may_replace": ["minecraft:air"],
		"may_attach_to": {
			"north": "minecraft:glass",
			"south": "minecraft:glass",

			"auto_rotate": true
		}
	}
}
```

Specifically, with the preceding code, the force conduit block would be sandwiched between adjacent glass along opposing lateral sides — regardless of the orientation.

### Ore Features
```json
{
	"format_version": "1.13.0",

	"minecraft:ore_feature": {
		"description": {
			"identifier": "deepest_depths:starlite_ore_cluster"
		},

		"count": 4,
		"replace_rules": [
			{
				"places_block": "deepest_depths:starlite_ore",
				"may_replace": [
					"minecraft:stone"
				]
			}
		]
	}
}
```

**Ore features** place clusters of blocks around a target position. The blocks placed by ore features vary via [replacement rules](#replacement-rules). Only the **block count** in ore features is global, controlled by the `"count"` property.

::: tip NOTE
The shape of the cluster cannot be controlled; to achieve this, use [scatter features](#scatter-features) with a [custom distribution system](#).
:::

#### Replacement Rules
```json
"replace_rules": [
	{
		"places_block": "infinitum:exposed_pylon",
		"may_replace": [
			"minecraft:air"
		]
	},
	{
		"places_block": "infinitum:submerged_pylon",
		"may_replace": [
			"minecraft:water"
		]
	}
]
```

In ore features, **replacement rules** bind target blocks to replacement lists that restrict the target’s placement; these rules are given with `"replace_rules"`. **Target blocks** are the blocks placed by a replacement rule, provided with the required `"places_block"` property; **replacement lists** (via `"may_replace"`) are optional arrays that only allow replacement of specific blocks. The block selected for a given position in the cluster will be the target block of the first matching rule. If a replacement list is not provided, that rule will always succeed in its position amongst the other rules, and all future rules will be ignored.

### Structure Template Features
```json
{
	"format_version": "1.13.0",
	"minecraft:structure_template_feature": {
		"description": {
			"identifier": "forgotten_worlds:blackmoor_castle_feature"
		},

		"structure_name": "forgotten_worlds:blackmoor_castle",

		"facing_direction": "random",
		"constraints": {
			"block_intersection": {
				"block_allowlist": [
					"minecraft:air",
					"minecraft:stone",
					"minecraft:dirt",
					"minecraft:grass"
				]
			},
			"unburied": {}
		},
		"adjustment_radius": 4
	}
}
```

**Structure template features** generate structures by referencing saved structure files. These features trade power and flexibility for convenience.

::: warning
Unlike with data-driven features, blocks in structure features are *not* automatically waterlogged if placed in water.
:::

The **target structure** is placed with the `"structure_name"` string property. This string follows a unique naming system to select a `.mcstructure` file from the behavior pack; it follows the form `namespace:path`. Structure files must be placed in the top-level `structures` directory; any hierarchy of folders from here is allowed but not required. If the structure file is placed directly in the `structures` directory, the default namespace `mystructure` is used. Otherwise, if placed in a directory inside `structures`, that directory name is used as the namespace. If any nesting is present within this directory, it is reflected in the path. Finally, the file extension (`.mcstructure`) is omitted.

For some examples:

| Structure file location | Associated `"structure_name"` |
|:--|:--|
| `/structures/well.mcstructure` | `"mystructure:well"` |
| `/structures/farmstead/silo.mcstructure` | `"farmstead:silo"` |
| `/structures/campsites/taiga/rustic/tents/wool.mcstructure` | `"campsites:taiga/rustic/tents/wool"` |

::: warning
[Due to constraints in the feature system](#), large structures may need to be pre-sliced into smaller structures and positioned together.
:::

#### Rotation
```json
"facing_direction": "south"
```

**Structure rotation** is performed using the `"facing_direction"` property, which accepts the four lateral directions: `"north"`, `"south"`, `"east"`, and `"west"`, and an additional `"random"` property to shuffle amongst them each instance. South is the “default” direction; structures extend into the positive *x* and *z* directions using this orientation.

::: warning
For non-South-oriented structures, not all block states are updated to accommodate the rotation, causing some rotatable blocks, such as vines, to hang in invalid positions.
:::

Rotations are performed clockwise from a top-down perspective. Unfortunately, rotations occur around the [structure origin](#), not the center, so large structures may be cut off in random rotation due to [feature limitations](#). Using a set rotation, however, will orient in reliable (albeit inconvenient) ways. All rotations begin inclusively from the [feature origin](#) and are generated with the following orientations:

| Rotation | *x* Projection | *z* Projection | Clockwise rotation from above |
|:--|:--|:--|:--|
| `"east"` | Positive | Negative | 270° |
| `"south"` | Positive | Positive | 0° |
| `"west"` | Negative | Positive | 90° |
| `"north"` | Negative | Negative | 180° |

Therefore, if a 7 × 6 feature is generated from an origin of (64, 64), an east rotation would occupy the lateral area from (64, 58) to (70, 65).

::: warning
Because of how rotation is handled, structure features typically need to be proxied by [weighted random features](#weighted-random-features) and [scatter proxies](#scatter-features) that offset position.
:::

#### Constraints
```json
"constraints": {
	"block_intersection": {
		"block_allowlist": [
			"minecraft:sand",
			"minecraft:sandstone",
			"minecraft:stone"
		]
	},
	"unburied": {},
	"grounded": {}
}
```

Structure features can enforce **constraints** using the required `"constraints"` property to restrict block intersection, adjust the placement position, and clear the space above the features using air. Although the property and its object (`{}`) are required, all sub-properties are optional.

##### Block Intersection
```json
"block_intersection": {
	"block_whitelist": [
		"minecraft:end_stone"
	]
},
```

The set of blocks the structure may replace are given by the **block whitelist**, given with `"block_whitelist"`. If even one block within the structure’s attempted volume is not in the whitelist, the structure will not be placed at that position. If no block intersection is provided, the structure may replace all blocks.

::: tip NOTE
Bizarrely, the `"block_whitelist"` property can also be given with `"block_allowlist"`. Both function the same.
:::

##### Ground Attachment
```json
"grounded": {}
```

The optional `"grounded"` component ensures the base of a structure is not overhanging into open space — air, water, or lava. All non-structure void, non-air blocks along the bottom layer of the structure are considered; if air, water, or lava is beneath even one such block, generation will fail.

##### Top Clearance
```json
"unburied": {}
```

The `"unburied"` component ensures a structure’s top is exposed to air for generation to succeed. Only non-structure void, non-air blocks on the top layer of the structure are considered, and all must be exposed to air above for the structure to successfully generate.

::: tip NOTE
Unlike [ground attachment](#ground-attachment), exposure to water is *not* considered.
:::

#### Placement Adjustment
```json
"adjustment_radius": 4
```

To accommodate possibly stringent [#constraints](#constraints), the optional `"adjustment_radius"` property is available; it accepts values from `0` (the default) to `16`. During placement, Minecraft will begin at the input position and radially search laterally outward up to the number of blocks specified by this property; vertical adjustment is not attempted. Each corresponding volume will be checked for validity; [block intersection](#block-intersection), [ground attachment](#ground-attachment), and [top clearance](#top-clearance) are all considered. The first success, if one exists, is used.

::: tip
If vertical adjustment should be used, proxy the structure feature with a [search feature](#search-feature).
:::

### Growing Plant Features
```json
{
	"format_version": "1.13.0",
	"minecraft:growing_plant_feature": {
		"description": {
			"identifier": "echelon:bulbous_cerulon"
		},

		"growth_direction": "up",
		"height_distribution":  [
			[{"range_min": 4, "range_max": 12}, 1]
		],
		"age" : 11,

		"body_blocks" : [
			["echelon:bulbous_cerulon_stem", 1],
			["echelon:bulbous_cerulon_spiked_stem", 1]
		],
		"head_blocks" : [
			["echelon:bulbous_cerulon_bulb", 1],
			["echelon:bulbous_cerulon_bulb_exposed", 1]
		],

		"allow_water": true
	}
}
```

**Growing plant features** place columns of blocks divided in two parts: a body and a head. Both can be randomized per-block for fine-tuned customization.

### Tree Features
```json
{
	"format_version": "1.13.0",
	"minecraft:tree_feature": {
		"description": {
			"identifier": "forgotten_forests:grand_oak"
		},

		"base_block": [
			"minecraft:dirt",
			"minecraft:coarse_dirt"
		],
		"base_cluster": {
			"num_clusters": 4,
			"cluster_radius": 3,
			"may_replace": ["minecraft:air"]
		},

		"may_replace": ["minecraft:air"],

		"fancy_trunk": {
			"trunk_block": "minecraft:log",

			"trunk_height": {
				"base": 24,
				"variance": 9,
				"scale": 1
			},
			"trunk_width": 3,
			"width_scale": 2,

			"foliage_altitude_factor": 0.5,
			"branches": {
				"slope": 0.33,
				"density": 0.25,
				"min_altitude_factor": 0
			}
		},

		"fancy_canopy": {
			"height": 3,
			"radius": 4,
			"leaf_block": "minecraft:leaves"
		}
	}
}
```

**Tree features** generate tree-like shapes. Tree features allow for more customization than any other feature type, including:

- Setting wood and leaf blocks
- Adding tree face decorations
- Restricting foundation and intersection blocks
- Customizing branch frequency and angle

Tree features are composed of *many* sub-properties to reflect the many variations of tree shapes found in vanilla gameplay. In general, these properties are divided into [setup](#setup-properties), [trunk](#trunk-properties), and [canopy](#canopy-properties) properties.

#### Setup Properties
```json
"base_block": [
	"minecraft:dirt",
	"minecraft:grass"
],
"base_cluster": {
	"may_replace": [

	],
	"num_clusers": 2,
	"cluster_radius": 3
},

"may_grow_on": [

],
"may_replace": [

],
"may_grow_through": [

]
```

Foundation and intersection blocks for the tree are specified using **setup properties**.

#### Trunk Properties
**Trunk properties** establish the trunk and branches.

##### Trunks
```json

```

##### Acacia Trunks
```json

```

##### Fancy Trunk
```json

```

##### Mega Trunk
```json

```

##### Fallen Trunk
```json

```

#### Canopy Properties
Tree canopies are constructed using **canopy properties**.

##### Canopies
```json

```

##### Fancy Canopies
```json

```

##### Mega Canopies
```json

```

##### Spruce Canopies
```json

```

##### Pine Canopies
```json

```

##### Mega Pine Canopies
```json

```

##### Acacia Canopies
```json

```

##### Roofed Canopies
```json

```

##### Random Spread Canopies
```json

```


### Multiface Features
::: warning
Multiface features are currently bugged and should not be used. At most 2 iterations are being placed — regardless of the spread chance. [Scatter features](#scatter-features) are a viable substitute in the meantime.
:::

```json
{
	"format_version": "1.13.0",
	"minecraft:multiface_feature": {
		"description": {
			"identifier": "underworld:decay_spread"
		},

		"places_block": "underworld:decay",

		"search_range": 8,
		"chance_of_spreading": 0.5,

		"can_place_on_ceiling": false,
		"can_place_on_floor": false,
		"can_place_on_wall": true,
		"can_place_on": [
			"minecraft:stone",
			"minecraft:deepslate",
			"minecraft:tuff"
		]
	}
}
```

Multiface features randomly place sequences of blocks on surfaces based on the success of the previous element of the sequence. **Surfaces** are defined as between either air or water and any other block.

#### Spread Mechanics
```json
"search_range": 4,
"chance_of_spreading": 0.75
```

Multiface features begin by attempting to place the **target block** (via the `"places_block"` property) at the [input position](#) of the multiface feature. For each subsequent attempt, a roll is made against the **spread chance**. The spread chance is given with the `"chance_of_spreading"` float property; it ranges from `0` (never successful) to `1` (always successful). If it succeeds, the next block in the sequence will be placed randomly within a cube centered on the input position that has a half side length equal to the value given by `"search_range"`. The sequence continues until a block fails to be placed. The search range may be between `1` and `64`.

#### Placement Restrictions
```json
"can_place_on_ceiling": true,
"can_place_on_floor": false,
"can_place_on_wall": true,
"can_place_on": [
	"minecraft:log",
	"minecraft:log2",
	"minecraft:leaves"
]
```

Multiface features use **placement restrictions** to limit block attachment. With any iteration (including the first), if the placement check fails, the sequence is terminated. 3 required boolean properties control where the target can be placed:

- "can_place_on_floor"
- "can_place_on_ceiling"
- "can_place_on_wall"

When these properties are true, their corresponding surfaces are eligible for attachment. Of course, at least one property must be true, or the sequence will never begin.

::: tip NOTE
These properties *do not* dictate block state, only attachment. Multiface blocks, such as torches, will not automatically orient to the appropriate face. Furthermore, if the target block supports simultaneous attachment to multiple faces and would be attached to a face whitelisted by these properties, it may also automatically attach to a face that is *not* whitelisted.
:::

An optional whitelist of blocks to which the target may attach is available via the `"can_place_on"` array property. Omitting this property defaults to allowing all blocks to attach.

## Proxy Features
Proxy features group, arrange, or gate features, including other proxy features. Proxy features themselves are incapable of having a direct effect on world generation.

All proxy features must therefore point to one or multiple **target features**: the features that are placed, rearranged, or selected by proxy features. Target features are represented as string references to the identifier of the intended feature.

### Scatter Features
```json
{
	"format_version": "1.13.0",

	"minecraft:scatter_feature": {
		"description": {
			"identifier": "arboreal:flower_patch"
		},

		"places_feature": "arboreal:flowers",

		"scatter_chance": {
			"numerator": 2,
			"denominator": 3
		},
		"iterations": "v.flower_patch.size = math.random_integer(6, 14); return math.random_integer(math.pow(v.flower_patch.size, 2) / 4, math.pow(v.flower_patch.size, 2) / 3);",

		"project_input_to_floor": true,
		"x": {
			"distribution": "gaussian",
			"extent": [0, "v.flower_patch.size"]
		},
		"z": {
			"distribution": "gaussian",
			"extent": [0, "v.flower_patch.size"]
		},
		"y": 0
	}
}
```

**Scatter features** are the most flexible and useful feature type available. Scatter features can:
- Distribute or reposition a feature any number of times within a [chunk’s feature domain](#)
- Act as a gate to conditionally enable a feature to be placed
- Execute MoLang within the current [feature context](#)

Scatter features attempt to place a [target feature](#proxy-features) with each iteration:
```json
"places_feature": "lostlands:shimmerfields_spire"
```

If, where, and how an instance of the target is placed depend on the [generation potential](#generation-potential), [distribution](#distribution), and the [evaluation order](#evaluation-order)

#### Generation Potential
```json
"scatter_chance": 25,
"iterations": 12
```

A scatter feature will determine placement attempts of its target using the `"scatter_chance"` and `"iterations"` properties.

**Scatter chance** represents the potential for the scatter feature to succeed. It can be represented as…

A numeric literal:
```json
"scatter_chance": 12.5
```

::: warning
The numeric literal form is considered against 100, not 1. A scatter chance of `50`, therefore, has half a chance of success.
:::

A MoLang expression:
```json
"scatter_chance": "1 / 8"
```

A fraction object:
```json
"scatter_chance": {
	"numerator": 1,
	"denominator": 8
}
```

All 3 examples have a 12.5% chance for success. Use whichever form feels most appropriate for your case. If scatter chance is omitted, it defaults to a 100% chance for the scatter feature to attempt to place its target.


**Iterations** are the number of attempts a scatter feature will try to place its target. If an instance of a scatter feature would succeed (in other words, if its scatter chance check were successful), *all* of the iterations given by `"iterations"` will be attempted. Iterations may be represented as integer literals or MoLang expressions. Unlike scatter chance, iterations are required.

#### Distribution
```json
"x": {
	"distribution": "fixed_grid",
	"extent": [0, 15]
},
"z": {
	"distribution": "fixed_grid",
	"extent": [0, 15]
},
"y": 0
```

Distribution is predominantly handled using **coordinate properties**: `"x"`, `"z"`, and `"y"`. All these properties may be represented using…

An integer literal:
```json
"x": 0
```

A MoLang Expression:
```json
"x": "math.random_integer(0, v.surface_grass.spread - 1)"
```

Or a number of object forms for conveniently distributing a coordinate:
```json
"x": {
	"distribution": "uniform",
	"extent": [0, 16]
}
```

Literals and MoLang expressions are relative to the [feature origin](#). See [Distribution Types](#distribution-types) for the available pre-constructed distribution systems.

Because placement of features is so often relative to the heightmap, the incoming *y*-origin for the scatter feature may be **projected into the heightmap**:

```json
"project_input_to_floor": true
```

This means that the specified *y*-origin from the scatter feature’s parent is ignored in favor of the *y*-coordinate of the heightmap at an iteration’s *x*-*z* location ([assuming the *y*-coordinate would be evaluated after the lateral coordinates](#evaluation-order)). The `"y"` property may still be given a value that will represent the offset from the heightmap.

::: tip NOTE
Functionally, this is the same as using the MoLang expression `"query.heightmap(v.worldx, v.worldz) + *offset*"`.
:::

##### Distribution Types
Custom distribution systems can be constructed using MoLang expressions, but scatter features come pre-equipped with a few common **distribution types** for convenient authoring:

- Uniform
- Gaussian
- Inverse Gaussian
- Fixed grid
- Jittered grid

Each distribution type requires an **extent**, which represents the range of values on which that distribution operates, from minimum to maximum. Extents, like the basic forms of coordinate declarations, are relative to the [feature origin](#).

###### Uniform Distribution
```json
"z": {
	"distribution": "uniform",
	"extent": ["v.boulder_spread.start", "v.boulder_spread.end"]
}
```

**Uniform distribution** is uniformly random distribution on a half-open interval between two values. It is known as “uniform” because every value within the range has an equal chance of being selected and “half-open” because the extent minimum is a member of the range, while the extent maximum is not:

*minimum extent* <= *x* < *maximum extent*

Therefore, if an extent of `[0, 16]` were given for a uniform distribution, blocks may be placed in a range of size 16: from 0 to 15. The 1st possible position starts at 0 while the 15th possible position ends at 16, matching the extent.

###### Gaussian Distributions
```json
"y": {
	"distribution": "gaussian",
	"extent": [0, "2 * v.vine_cluster.radius"]
}
```

**Gaussian distribution** (`"gaussian"`) and its **inverse** (`"inverse_gaussian"`) are useful for grouping features together: toward or away from the center of the extent respectively. Gaussian distribution is so extreme that values will almost never be selected away from the center with normal Gaussian distribution or toward the center with inverse Gaussian distribution. The extents for Gaussian distribution behave the as with [uniform distribution](#uniform-distribution).

###### Grid Distributions
```json
"x": {
	"distribution": "jittered_grid",
	"extent": [0, 15],
	"step_size": 2,
	"grid_offset": 4
}
```

**Grid distributions** are powerful systems for placing blocks either directly on (`"fixed_grid"`) or randomly within (`"jittered_grid"`) evenly spaced intervals along a coordinate. Unlike the other distribution types, the extent of grids forms an interval that includes the maximum extent:

*minimum extent* <= *x* <= *maximum extent*

Two grid distribution-only properties are available for finer control over the grids used by these systems. The interval size, which defaults to 1, can be customized with the `"step_size"` property. An initial offset, defaulting to 0, can also be provided via the `"grid_offset"` property.

If the iteration count in conjunction with the step size and offset would push a coordinate beyond the maximum extent, the coordinate will be wrapped back to the minimum extent and continue from there.

While grids are useful on a coordinate independently, their true power shows when in combination with grid distributions on other coordinates. Placements prioritize incrementing the earliest evaluated grid system before later systems; the later layouts are only considered when wrapping occurs in the previous grid system. When a placement in an earlier evaluated coordinate would wrap, the next evaluated grid-powered coordinate will be offset by the number of wraps that occurred.

As a simple example:
```json
"iterations": 21,

"x": {
	"distribution": "fixed_grid",
	"extent": [0, 15]
},
"z": {
	"distribution": "fixed_grid",
	"extent": [0, 15]
}
```

Placements will first begin along *x*: (0, 0), (1, 0), etc., until reaching the end of the extent at (15, 0). However, only 16 of the 21 iterations have occurred; 5 remain. Now, the *x*-coordinate wraps back around to 0, while the *z*-coordinate increments to 1: (0, 1).

This wrapping occurs in three-dimensions, too, so when a plane along the earliest evaluated coordinates would wrap (assuming a high enough iteration count), another plane will begin formation based on the final coordinate’s step size.

::: warning
Grid extents behave in unexpected ways when 0 is not within the extent range. In particular, the extent will be projected into 0 by the closest bound. For example, the given extent `[-7, -2]` will be remapped as though it were `[-5, 0]`. `[13, 21]` would get remapped to `[0, 8]`. For this reason, it's recommended to just specify the extent as a length, such as using `[0, 8]` in the latter example, and proxying that scatter feature with another scatter feature that would position that coordinate using a literal `13`.

When using multiple grid distributions to form a surface or volume, extents for any coordinate that would extend below `0` will only work on the first pass of that coordinate. Later passes will be restricted to non-negative values.
:::

#### Evaluation Order
When a scatter chance is included, it is evaluated before any other properties. If the check against scatter chance fails for that instance of the scatter feature, nothing downstream within that instance is evaluated. No further MoLang is interpreted; no variables within the [feature context](#) are updated. The target feature is entirely disregarded.

Next, the iteration count is evaluated. Similarly to scatter chance, if the iteration count were not to resolve to a positive number of placement attempts, nothing further is evaluated.

Next, every iteration is attempted regardless of whether an early iteration would for some reason fail. For each iteration, each coordinate is evaluated using the same ordering across all iterations.

::: warning
The order of coordinate evaluation is *not* dependent upon the order the coordinate properties are declared in JSON.
:::

By default, the coordinate ordering is *x* then *z* then *y*. This covers the majority of use-cases: if the coordinates aren’t independent, more than likely the vertical position depends on the lateral coordinates. However, scatter features may declare an atypical **coordinate evaluation order** for full control over coordinate dependence:

```json
"coordinate_eval_order": "zyx"
```

After the coordinates for an iteration have been determined, world generation moves its focus within the target: acknowledging its restrictions, attempting its placement, evaluating its MoLang, and (if possible and relevant) continuing by placing its children and their children and so forth.

When finished with the target’s feature tree, if more iterations have yet to be run from the scatter feature, focus returns to the scatter feature beginning with the first-evaluated coordinate and execution is resumed.

### Conditional Lists
```json
{
	"format_version": "1.13.0",

	"minecraft:conditional_list": {
		"description": {
			"identifier": "olympus:columns_selection"
		},

		"conditional_features": [
			{
				"places_feature": "olympus:columns_unweathered",
				"condition": "query.noise(v.originx, v.originz) < 0"
			},
			{
				"places_feature": "olympus:columns_weathered",
				"condition": "query.noise(v.originx, v.originz) >= 0"
			}
		],

		"early_out_scheme": "placement_success"
	}
}
```

**Conditional lists** pick a single feature from a collection based on conditions; they are akin to if-else if blocks in programming languages. Once a condition has been evaluated as successful (as determined via [success determination](#success-determination), the conditional list will select *only that one feature* for placement.

::: tip NOTE
Instead, if *every* success should place a feature in the same location, use an [aggregate feature](#aggregate-features) pointing to [scatter features](#scatter-features) that proxy the target features.
:::

#### Conditions List
```json
"conditional_features": [
	{
		"places_feature": "summer_fun:beachadjustment_water",
		"condition": "query.heightmap(v.originx, v.originz) < 63 && query.noise(v.originx, v.originz) < 0"
	},
	{
		"places_feature": "summer_fun:beachadjustment_coral",
		"condition": "query.heightmap(v.originx, v.originz) < 63 && query.noise(v.originx, v.originz) >= 0"
	},
	{
		"places_feature": "summer_fun:beachadjustment_air",
		"condition": "query.noise(v.originx, v.originz) >= 63"
	}
]
```

The **conditions list**, `"conditional_features"`, is an ordered array comprised of **feature entries** objects. Feature entries bind [target features](#proxy-features) to their **conditions**:

```json
{
	"places_feature": "verona:evergreen_trees_stumps",
	"condition": "v.evergreen_forest.type == v.evergreen_forest.types.lumberjack_ruined"
}
```

The condition of each feature entry is evaluated by entry order in the conditions list. Once a feature entry [would succeed](#success-determination), no later-listed conditions will be evaluated.

#### Success Determination
```json
"early_out_scheme": "placement_success"
```

Condition success is considered in light of the optional **early out scheme**. Two mechanisms are provided for controlling if a feature entry would succeed. `"condition_success"` — the default if no `"early_out_scheme"` is provided — considers a success to occur when a condition evaluates to true. `"placement_success"` goes further: a condition must evaluate to true, and its target feature’s placement must succeed.

### Aggregate Features
```json
{
	"format_version": "1.13.0",

	"minecraft:aggregate_feature": {
		"description": {
			"identifier": "better_villages:village_center"
		},

		"features": [
			"better_villages:village_center_well",
			"better_villages:village_center_grass_path"
		],
		"early_out": "first_failure"
	}
}
```

**Aggregate features** successively place features from a given list at the input location. Aggregate features are typically used to build custom scenes comprised of many disparate features.

The features to be placed by the aggregate are given by the required **features list**. Each feature in this list — [if placed](#placement-escape) — will be positioned *in order of declaration* at the same spot. Aggregate features will often need to point to [scatter features](#scatter-features) to position elements of a scene.

#### Placement Escape
```json
"early_out": "first_success"
```

By default, every entry in the features list will attempt to be placed. A **placement escape** is provided via the `"early_out"` property, which accepts 3 values:

| Value | Description |
|:--|:--|
| `"none"` | Attempt to place each feature (default) |
| `"first_success"` | Stop placing features once the first successful placement occurs |
| `"first_failure"` | Stop placing features once the first failed placement occurs |

### Sequence Features
::: warning
Sequence features are currently bugged and should not be used. Currently, all features in the features list generate at the same input location, like [aggregate features](#aggregate-features).
:::

```json
{
	"format_version": "1.13.0",

	"minecraft:sequence_feature": {
		"description": {
			"identifier": "first_nations:totem_pole"
		},

		"features": [
			"first_nations:totem_pole_base",
			"first_nations:totem_pole_body",
			"first_nations:totem_pole_head"
		]
	}
}
```

**Sequence features** place a collection of features in spatial sequence.

Features are ordered via the **features list**, given by the `"features"` property. The output location from the previous feature becomes the input location of the subsequent feature. As an example, if the origin of the sequence feature were at (0, 67, 0), and the first listed feature were a column that extended 10 blocks vertically, the input position for the next listed feature would be (0, 77, 0).

### Snap-to-Surface Features
```json
{
	"format_version": "1.16.0",

	"minecraft:snap_to_surface_feature": {
		"description": {
			"identifier": "herbs_and_spices:underground_silas_plant_snap"
		},

		"feature_to_snap":  "herbs_and_spices:underground_silas_plant",

		"vertical_search_range": 12,
		"surface": "floor"
	}
}
```

Features can be pinned to a floor or ceiling when proxied by **snap-to-surface features**. Currently, the **target feature**, given with `"feature_to_snap"`, can only be projected through air onto solid surfaces.

The **target surface** is given with the optional `"surface"` property, which accepts either `"floor"` or `"ceiling"`, defaulting to `"floor"`.

### Search Features
```json
{
	"format_version": "1.13.0",

	"minecraft:search_feature": {
		"description": {
			"identifier": "search_features:search_feature"
		},

		"places_feature": "search_features:search_feature_obsidian",

		"search_volume": {
			"min": [0, 0, 0],
			"max": [7, 7, 7]
		},

		"search_axis": "y",
		"required_successes": 512
	}
}
```

**Search features** search a volume for valid placement locations for a target feature. These features are a great option when positioning features with challenging placement conditions.

The **target feature** is placed with the `"places_feature"` property. The success of its placement depends on whether the required successes threshold is met within the search volume. The placement conditions of the target feature are successively checked at each location within the volume before any placement occurs.

#### Search Volume
```json
"search_volume": {
	"min": [-12, 0, -12],
	"max": [11, 11, 11]
},
```

The **search volume** declares the space in which the search will occur. Two vectors define the bounds of this volume: `"min"`, which points to the corner with the lowest coordinates and `"max"`, which points to the *origin of the block* in the opposite corner. The coordinates of the maximum corner therefore extend 1 block in each dimension beyond what is given by the `"max"` vector. As an example, the following search volume actually covers 8 blocks, not 1:

```json
"search_volume": {
	"min": [0, 0, 0],
	"max": [1, 1, 1]
},
```

#### Placement Success


### Rect Layouts
::: warning
Rect layouts are currently bugged and should not be used. No information has been provided about how they will work. Presumably, rect layouts divide the surface area of a chunk into the provided rectangles given by `"area_dimensions"` and place their associated features based on the declared ratio of empty space.
:::

```json
{
	"format_version": "1.13.0",

	"minecraft:rect_layout": {
		"description": {
			"identifier": "gardenpalooza:garden_maze"
		},

		"ratio_of_empty_space": 0.5,
		"feature_areas":[
			{
				"feature": "gardenpalooza:flower_patch",
				"area_dimensions": [2, 4]
			},
			{
				"feature": "gardenpalooza:garden_hedge",
				"area_dimensions": [1, 3]
			}
		]
	}
}
```

### Scan Surface Features
```json
{
	"format_version": "1.13.0",

	"minecraft:scan_surface": {
		"description": {
			"identifier": "yosemite:fallen_leaves_cover"
		},

		"scan_surface_feature": "yosemite:fallen_leaves"
	}
}
```

Every block across the surface of a chunk can be covered by a feature using **scan surface features**. For this reason, it is strongly recommended to choose a feature that only occupies a column’s space.

The **target feature** to be placed is given with the `"scan_surface_feature"` property. Placement position is the same as [the MoLang query `heightmap`](#), which means that water surfaces are used instead of their floors. It is therefore typically recommended to use [scatter features](#scatter-features) with a *y* expression utilizing the [`above_top_solid` query](#).

### Weighted Random Features
```json
{
	"format_version": "1.13.0",

	"minecraft:weighted_random_feature": {
		"description": {
			"identifier": "sweet_tooth:gelatin"
		},

		"features": [
			["sweet_tooth:gelatin_green", 3],
			["sweet_tooth:gelatin_red", 3],
			["sweet_tooth:gelatin_blue", 2],
			["sweet_tooth:gelatin_purple", 1]
		]
	}
}
```

**Weighted random features** randomly select a feature from a list. They are typically used to provide variation across a set of related features.

Weighted random features select from their **weighted feature list**. Each entry in the list is an array made of a feature reference and an integer weight. A weighted random feature can select a different feature each instance it is run.

::: tip NOTE
To understand how weights work, see [the associated section in Probabilities](#).
:::

## Scene Features
Scene features are a sort of combination of content features and proxy features. They are opinionated feature types designed around an aesthetic necessary for vanilla generation.

Scene features only allow minimal customizations of their shapes to achieve their intended aesthetic. Like content features, though, their blocks are conveniently modifiable, and like proxy features, they can place their own sub-features.

### Geode Features
```json
{
	"format_version": "1.13.0",
	"minecraft:geode_feature": {
		"description": {
			"identifier": "insectorium:wasp_hive"
		},

		"max_radius": 12,

		"filler": "minecraft:air",

		"inner_layer": "insectorium:wasp_hive_inside",
		"alternate_inner_layer": "insectorium:wasp_hive_spawner_base",
		"use_alternate_layer0_chance": 0.125,

		"middle_layer": "insectorium:wasp_hive_inside",

		"outer_layer": "insectorium:wasp_hive_shell",

		"inner_placements": ["insectorium:wasp_hive_spawner"],
		"placements_require_layer0_alternate": true,
		"use_potential_placements_chance": 1,

		"min_distribution_points": 2,
		"max_distribution_points": 4,
		"min_outer_wall_distance": 2,
		"max_outer_wall_distance": 4,
		"min_point_offset": 0,
		"max_point_offset": 2,
		"noise_multiplier": 0.125,
		"invalid_blocks_threshold": 64,

		"crack_point_offset": 0,
		"generate_crack_chance": 1,
		"base_crack_size": 1
	}
}
```

**Geode features** construct spherical structures comprised of multiple block layers; they allow placement of sub-features along walls of the interior.

### Beards and Shavers
::: warning
Beards and shavers are currently bugged and should be avoided. In particular, the platform is poorly constructed, with the surface block usually generating on the incorrect layer and the shape being cut off awkwardly.
:::

```json
{
	"format_version": "1.13.0",

	"minecraft:beards_and_shavers": {
		"description": {
			"identifier": "broadmoor_wars:highland_tower_foundation"
		},

		"places_feature": "broadmoor_wars:highland_tower",
		"y_delta": 0,

		"bounding_box_min": [-4, 0, -4],
		"bounding_box_max": [5, 12, 5],
		"beard_raggedness_min": 0.25,
		"beard_raggedness_max": 0.5,

		"surface_block_type": "minecraft:grass",
		"subsurface_block_type": "minecraft:dirt"
	}
}
```

**Beards and shavers** simultaneously provide a platform (beard) and a clearance (shaver) for a feature to generate.

### Vegetation Patch Features
```json
{
	"format_version": "1.13.0",

	"minecraft:vegetation_patch_feature": {
		"description": {
			"identifier": "tension:shiitake_patch"
		},

		"horizontal_radius": 4,
		"extra_edge_column_chance": 0.5,

		"surface": "floor",
		"vertical_range": 5,

		"ground_block": "minecraft:mycelium",
		"replaceable_blocks": [
			"minecraft:dirt",
			"minecraft:grass"
		],
		"depth": 4,
		"extra_deep_block_chance": 0.5,

		"vegetation_feature": "tension:shiitake_mushroom",
		"vegetation_chance": 0.125
	}
}
```

**Vegetation patches** place sub-features (often vegetation) within a square-like boundary (the patch).

Vegetation patches fundamentally perform 4 operations:

- Determine a lateral patch shape from a given radius
- Search vertically from the [input position](#) of every block in the shape for a surface (ceiling or floor)
- Place columns of blocks into the surface
- Generate sub-features randomly within the created patch

#### Patch Shape
```json
"horizontal_radius": 3,
"extra_edge_column_chance": 0.25
```

Vegetation patches commence by constructing the patch’s lateral shape. This shape is centered on the *x* and *z* of the [input position](#). From here, the required `"horizontal_radius"` specifies how far away in all lateral directions the initial shape should extend. This shape doesn’t use [taxicab distance](#); instead, the corners are filled in, constructing a simple square. The size of this square is given by:

*horizontal radius* * 2 + 1

Therefore, a horizontal radius of 4 will generate a square of side length 9, centered on the input *x* and *z*.

Patch shape can be mildly randomized using the optional `"extra_edge_column_chance"` property. This property accepts values between `0`, the default, and `1` inclusively, indicating the odds for any of the blocks along the outside of the perimeter to be included in the patch shape. These perimeter blocks do not include the outer perimeter corners. If the corners are ignored, setting this property to `1` is equivalent to increasing the horizontal radius by 1.

#### Patch Search
```json
"surface": "ceiling",
"vertical_range": 8
```

The vegetation patch then searches each column within the determined patch shape from the *y*-component of the [input position](#) vertically to find the appropriate surface, given with the optional `"surface"` property. Either `"floor"` (the default if unspecified) or `"ceiling"` may be provided. The surface search only functions against air; no other contrast of blocks may be used. The search itself, however, may begin from within any block.

The distance searched is given with `"vertical_range"`, which is required and has no tangible limit. The search occurs bidirectionally. As an example, if starting from a *y* of 70 and using a vertical range of `5`, surfaces between 65 and 75 inclusively will succeed.

Only the first matched surface within range in a column will be used. When targeting floor surfaces, the first match is the highest surface. If targeting ceilings, the first match is the lowest surface.

#### Patch Column Placement
```json
"ground_block": "arabia:lush_sand",
"waterlogged": true,
"replaceable_blocks": [
	"minecraft:sand",
	"minecraft:sandstone"
],
"depth": 2,
"extra_deep_block_chance": 0.75
```

Patch column generation is then attempted in each column whose surface search succeeds. Columns are generated procedurally, starting at the input position and continuing away into the surface.

The block that forms the solid foundation of the patch is given with the `"ground_block"`. Its length into the surface is given with `"depth"`. As expected, a depth of `0` will generate no blocks as part of the patch column, but negative values will generate a column that continues indefinitely until reaching a non-whitelisted block.

The optional `"extra_deep_block_chance"` property provides a chance for each column to attempt generation of an additional block, increasing the depth of that column by 1. It takes a value between `0` and `1` inclusively, defaulting to 0. Setting the property to `1` has the same effect as increasing the depth by 1.

::: tip NOTE
The [vertical range](#patch-search) takes no further affect in generation after the search phase. If a column were to barely be within search range, its entire depth would still be attempted. Furthermore, if a surface would be out of the vertical range but blocks in that column would fall within the range, those blocks will still be ignored. Placement begins from the surface and continues downward when targeting [floor surfaces](#patch-search), and vice versa.
:::

A whitelist of blocks must be provided via the `"replaceable_blocks"` property. When generating a patch column, each block is checked and placed in order. If a non-whitelisted block is detected, generation of that column ceases. It is therefore possible for columns not to reach their target depth. Failure of a single column’s generation has no effect on other columns.

Lastly, the optional boolean `"waterlogged"` property attempts to replace the topmost block in a patch column with water when set to true and `"surface"` is `"floor"`. Water will therefore be exposed to air along the surface. Water will not be substituted if one of its lateral faces is attached to air; this prevents water from spilling out. If `"waterlogged"` is omitted, water generation is disabled by default. When `"depth"` is `0` and waterlogging is enabled, blocks not whitelisted may be replaced with water anyway. For all other depth values, only whitelisted blocks will be replaced with water.

#### Vegetation Placement
```json
"vegetation_feature": "tension:shiitake_mushroom",
"vegetation_chance": 0.125
```

Finally, vegetation patches take a vegetation feature and corresponding generation chance to place sub-features at random locations on the surface of the patch. The sub-feature is given with the required `"vegetation_feature"` property. Every surface block generated has a chance to support this vegetation feature.

::: warning
Vegetation features multiple blocks in height that are attached to the surface of ceilings will still generate *upward* naturally. They must be constructed or proxied in such a way to generate downward from the ceiling.
:::

The chance that any block surface is selected as an input position for the sub-feature is given with the optional `"vegetation_chance"` float property, which defaults to `0`. Like the other chances in vegetation patch features, it ranges from 0 to 1 inclusively, where `0` will generate no sub-features and `1` will attempt to generate one for each block surface. Be wary of vegetation features that span more than a single column; collisions may occur, clumping individual features into a single mass.

For [floor-bound](#patch-search) patches, if [`"waterlogged"`](#patch-column-placement) is `false`, vegetation features generate directly on the surface and have the potential to generate on surface edges. If waterlogging is enabled, however, vegetation features can’t generate on surface edges but may generate in water, waterlogging the block if supported. When the [`"depth"`](#patch-column-placement) is `0`, sub-features may be placed even though no patch blocks support them.

::: warning
If waterlogging is enabled on a ceiling-targeting vegetation patch feature, no vegetation features will be placed.
:::

## Carver Features
Carver features are special feature types for modifying vanilla cave generation. Little can currently be customized using carvers. Carvers only include the classic spaghetti caves and not ravines or structures.

All carver features require being placed in the [pregeneration pass](#). Carver features can therefore not be combined with any other features by any means, even by proxies.

Carvers work by culling blocks around predetermined paths; these paths are unchangeable. Instead, carver features allow for customization of the **width modifier**, which is added to the base width variance provided by the game. This property is available across all carver features as `"width_modifier"`. Width modifiers only affect the lateral distance around the carver path, not the height. Negative values behave as normal subtraction: shrinking the carver instead of dilating it; low enough values, around `-16`, can be used on the vanilla carvers to remove caves.

::: warning
Although listed in the features schema as optional, `"width_modifier"` should always be provided; errors will be thrown relentlessly, and entire chunks will appear corrupted. Furthermore, large values for the width modifier (greater than approximately `16`) shouldn’t be used: world loading slows to a crawl, and chunks may get culled in entirety.
:::

Carvers don’t truly *cull* blocks per se; instead they replace existing blocks (such as from biome surface builders or earlier-placed carvers) with a **fill block**. The fill block can be provided with the optional `"fill_with"` property, whose default depends on the carver type; this property, too, is usable in all carver feature types.

::: warning
The block intersection set for carvers currently cannot be customized. Only vanilla blocks specific to each carver type will be replaced; custom blocks cannot be stripped to form caves.
:::

### Cave Carver Features
```json
{
	"format_version": "1.13.0",

	"minecraft:cave_carver_feature": {
		"description": {
			"identifier": "spelunkers_dreams:massive_cave"
		},

		"width_modifier": 4
	}
}
```

The classic Overworld caving system is controlled using **cave carver features**. These carvers only work when used in the Overworld.

Overworld caves naturally extend from just above the bedrock layer at *y*-3 to *y*s of indeterminate values over 100. The fill block for cave carver features defaults to air if omitted. Cave carver features strip typical Overworld surface and foundation blocks, such as stone variants, dirt variants, sand variants, and sandstone. However, water is not culled, and water in oceans and rivers is aggressively avoided.

### Underwater Cave Carver Features
```json
{
	"format_version": "1.13.0",

	"minecraft:underwater_cave_carver_feature": {
		"description": {
			"identifier": "aquamarine:underwater_thick_caves"
		},

		"width_modifier": 8
	}
}
```

**Underwater cave carver features** generate caves at lower heights in the Overworld — below the sea level of 63. These carvers, too, only work in the Overworld. Underwater carver features accept an additional optional property, `"replace_air_with"`, which is intended to substitute intersections of pre-existing air with a given block.

::: warning
This property currently seems non-functional. Whether acting on a biome whose foundation was air or intersecting an earlier-placed [cave carver feature](#cave-carver-feature) that used air, the intersecting air was never successfully replaced during testing.
:::

Underwater carvers replace the same natural vanilla blocks as [cave carver features](#cave-carver-features) with one addition: water. This means spiraling masses can be constructed from the fill block in underwater settings. Underwater carvers can begin at a height of 3; they won’t ever operate above *y*-63 (the Overworld sea level) even if they have the opportunity to do so.

::: warning
Underwater cave carvers won’t function in custom biomes — even if that biome uses vanilla blocks.
:::

### Hell Cave Carver Features
```json
{
	"format_version": "1.13.0",

	"minecraft:hell_cave_carver_feature": {
		"description": {
			"identifier": "hellscape:nether_caves"
		},

		"fill_with": "minecraft:magma",
		"width_modifier": 1
	}
}
```

Nether-based caves are formed via **Hell cave carver features**. Surprisingly, these carvers may be used in the Overworld in addition to the Nether; [biome filters]() must be applied to the feature rule to limit this occurrence.

Nether carvers extend from *y*s of 5 to 121, and their fill block defaults to air. Hell carvers strip the same set of blocks as [cave carver features](#cave-carver-features) with a few exceptions: hell carvers won’t strip sand variants or sandstone but will remove Netherrack and water.