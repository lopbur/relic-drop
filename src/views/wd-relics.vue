<template>
	<div class="relic">
		<div class="header">
			<v-img
				src="../assets/warframe_drops_banner.jpg"
				lazy-src="../assets/warframe_drops_banner.jpg"
				:height="$vuetify.breakpoint.smAndDown ? '400px' : '350px'"
				class="banner" ref="bannerImg"
			>
			</v-img>
			<div class="background"></div>
			<v-card tile dark
				:width="$vuetify.breakpoint.smAndDown ? '80%' : '60%'"
				:elevation="10"
				class="searchInput"
			>
				<v-text-field
					v-model="searchValue"
					label="Search..."
					id="id"
					class="px-5"
					single-line
					@keyup="setParam()"
				></v-text-field>
			</v-card>
			<v-card tile
				:elevation="5"
				style="z-index: 1"
			>
				<v-card-text class="d-flex justify-center">
					
				</v-card-text>
			</v-card>
		</div>
		<v-container grid-list-xs
			class="pa-0"
		>
			<div v-if="!relicLoading">
				<v-layout col wrap class="pa-0">
					<v-flex xs12 sm7 md8>
						<virtual-list
							:style="{ height: `${windowHeight - 64}px`, 'overflow-y': 'auto' }"
							:data-key="'relicName'"
							:data-sources="relicSearchResult"
							:data-component="itemComponent"
						/>
					</v-flex>
					<v-flex xs12 sm5 md4>
						<item-detail
							:src="itemDetail"
						>
						</item-detail>
					</v-flex>
				</v-layout>
			</div>
			<div v-else>
				<v-layout col wrap>
					<v-flex xs12
						class="d-flex justify-center"
					>
						<v-progress-circular
							indeterminate
							color="primary"
						></v-progress-circular>
					</v-flex>
				</v-layout>
			</div>
		</v-container>
	</div>
</template>

<script>

import VirtualList from 'vue-virtual-scroll-list'
import listItem from '../components/list-item.vue'
import itemDetail from '../components/item-detail'
import EventBus from '../util/event-bus.js'
import service from '../util/service.js'

export default {
	components: {
		'virtual-list': VirtualList,
		'item-detail': itemDetail,
	},
	data() {
		return { 
			relicLoading: false,
			searchValue: "",
			selectItemName: "",
			itemComponent: listItem,
			windowHeight: 800,
		}
	},
	methods: {
		setParam: function() {
			let path, keyword;
			if(this.searchValue.length < 2){
				path = '';
				keyword = '';
			} else {
				path = `/?search=${this.searchValue}`;
				keyword = this.searchValue;
			}

			if(this.$route.fullPath !== path) this.$router.push({query: {search: keyword}}).catch(err => err);
		},
		setWindowHeight: function() {
			this.windowHeight = window.innerHeight;
		}
	},
	computed: {
		fluidControl(){
			return {
				"container--fluid": this.$vuetify.breakpoint.mdAndDown,
			}
		},
		relicSearchResult(){
			return service.retrieveRelic(this.searchValue)
		},
		itemDetail() {
			let result = service.getRelicDetail(this.selectItemName);
			return result;
		},
	},
	mounted() {
		EventBus.$on('item-click', payload => {
			this.selectItemName = payload;
		});

		const query = this.$route.query.search || undefined;
		if(query) {
			this.searchValue = query;
		}
	},
	created() {
		this.relicLoading = true;
		service.init().then(() => {
			console.log("successfully downloaded data");
			this.relicLoading = false;
		}).catch(err => {
			console.log("error has occured:", err);
		})
	},
	beforeDestroy() {
		EventBus.$off('item-click');
	},
}
</script>

<style>
	.header {
		position: relative;
	}
	.header .searchInput {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
	}
</style>