<template>
	<v-app>
		<v-app-bar
		dark
		app
		>
				<v-img src="./assets/VoidProjectionsGoldD.webp" class="mx-2" max-width="50px" max-height="50px" contain></v-img>
				<v-toolbar-title><router-link to="/">Relic Drop</router-link></v-toolbar-title>
				<v-spacer></v-spacer>
				<v-tooltip left>
					<template v-slot:activator="{ on }">
						<v-btn
							href="https://github.com/lopbur/relic-drop"
							icon
							large
							target="_blank"
							v-on="on"
							class="ma-1"
						>
							<v-icon large>mdi-code-tags</v-icon>
						</v-btn>
					</template>

					<span>Source</span>
				</v-tooltip>
		</v-app-bar>
		<v-content>
			<router-view></router-view>
		</v-content>
	</v-app>
</template>

<script>
export default {
}
</script>

<style lang="scss">
	a {
		text-decoration: none;
		color: white !important;
	}
</style>
