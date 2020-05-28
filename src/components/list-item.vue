<template>
	<div>
		<v-card tile @click="handleGlobalItemClick">
			<div class="d-flex align-center">
				<v-avatar
					size="60"
					class="mx-5"
					tile
				>
					<v-img max-height="60px" max-width="60px" contain
						:src="`https://cdn.warframestat.us/img/${source.Radiant.imageName}`"
						:lazy-src="`https://cdn.warframestat.us/img/${source.Radiant.imageName}`"
					></v-img>
				</v-avatar>
				<v-card-title class="d-flex">
					{{ source.relicName }} Relic
				</v-card-title>
				<v-spacer></v-spacer>
				<div class="mx-5" v-if="source.dropLocations.length > 0">Able to acquire item</div>
				<div class="mx-5" v-else>Unable to acquire item</div>
			</div>
		</v-card>
	</div>
</template>

<script>
import EventBus from "../util/event-bus.js"

export default {
	name: 'item-component',
	props: {
		index: {
			type: Number,
		},
		source: {
			type: Object,
			default() {
				return {}
			}
		},
	},
	methods: {
		handleGlobalItemClick: function() {
			EventBus.$emit('item-click', this.source.relicName);
		}
	},
}
</script>

<style>

</style>