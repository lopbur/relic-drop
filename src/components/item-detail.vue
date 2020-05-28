<template>
	<v-card tile dark style="height: 100%">
		<div v-if="Object.keys(src).length > 0">
			<v-card-title primary-title
				class="d-flex justify-center"
			>
				{{ src.relicName }} {{ selectState }}
			</v-card-title>
			<div class="d-flex justify-center">
				<v-img
					:lazy-src="`https://cdn.warframestat.us/img/${src[selectState].imageName}`"
					:src="`https://cdn.warframestat.us/img/${src[selectState].imageName}`"
					max-width="350px"
				/>
			</div>
			<v-card-text>
				{{ src.description }}
			</v-card-text>
			<v-tabs
				v-model="stateTab"
				color="white"
				dark
				slider-color="white"
				centered
				show-arrows
			>
				<v-tab
					v-for="state in states" :key="state"
					@change="changeState(state)"
				>
					{{ state }}
				</v-tab>
			</v-tabs>
			<v-tabs
				v-model="detailTab"
				color="white"
				dark
				slider-color="white"
				grow
			>
				<v-tab>Rewards</v-tab>
				<v-tab>Drops</v-tab>
				<v-tabs-items v-model="detailTab" dark>
					<v-tab-item style="height: 400px">
						<v-card tile flat style="width: 100%">
							<div
								v-for="item in src[selectState].rewards" :key="item.id"
								class="d-flex"
							>
									<v-card-text class="d-flex">
										{{ item.itemName }}
										<v-spacer></v-spacer>
										{{ item.chance }} %
									</v-card-text>
							</div>
						</v-card>
					</v-tab-item>
					<v-tab-item style="overflow-y: auto; height: 400px">
						<v-card tile flat style="width: 100%">
							<div v-if="src.dropLocations.length > 0">
								<div
									v-for="location in src.dropLocations" :key="location.id"
									class="d-flex"
								>
										<v-card-text class="d-flex">
											{{ location.place }}
											<v-spacer></v-spacer>
											{{ location.chance }}
										</v-card-text>
								</div>
							</div>
							<div v-else>
								<v-card-title primary-title
									class="d-flex justify-center"
								>
									There are no drop data.
								</v-card-title>
							</div>
						</v-card>
					</v-tab-item>
				</v-tabs-items>
			</v-tabs>
		</div>
		<div v-else>
			<v-card-title primary-title
				class="d-flex justify-center"
			>
				There are no selected artifact.
			</v-card-title>
		</div>
	</v-card>
</template>

<script>
export default {
	props: {
		src: {
			type: Object,
			default: function() {
				return {};
			}
		},
	},
	data() {
		return {
			selectState: 'Radiant',
			stateTab: 3,
			detailTab: null,
			states: [
				'Intact', 'Exceptional', 'Flawless', 'Radiant',
			],
		}
	},
	methods: {
		changeState: function(state) {
			this.selectState = state;
		}
	},
}
</script>

<style>

</style>