import { defineConfig } from 'windicss/helpers'
// const colors = require('tailwindcss/colors')

export default defineConfig({
	plugins: [require('windicss/plugin/typography')],

	extract: {
		include: ['.vitepress/**/*.{vue,ts}'],
		exclude: ['**/*.md'],
	},

	theme: {
		extend: {
			transitionProperty: {
				spacing: 'margin, padding',
			},
		},
	},

	darkMode: 'class',
})
