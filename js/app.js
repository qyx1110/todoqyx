(function (window,Vue,undefined) {


	new Vue({
		el: '#app',
		data: {
			//我们的数据是在localStorage里面存储的 拿出来的时候是json字符串,使用json.parse转换
			dataList: JSON.parse(window.localStorage.getItem('dataList')) || [],
			newTodo: ''
		},
		methods: {
			//添加一个todo
			addTodo(){
				//判断内容不能为空
				if(!this.newTodo.trim()) return;
					
				//组装一个对象,把对象添加到数组里面
				this.dataList.push({
					content: this.newTodo.trim(),
					isFinish: false,
					id: this.dataList.length?this.dataList.sort((a,b)=>a.id-b.id)[this.dataList.length-1]['id']+1:1
				})
				this.newTodo = "";
			},
			
			//删除一个todo
			delTodo(index){
				this.dataList.splice(index,1)
			},

			//删除所有已经完成的todo
			delAll(){
				this.dataList = this.dataList.filter(item=>!item.isFinish)
			},

			// 让 当前li 添加 editing 类名
			// 显示编辑的文本框

			showEdit(index){
				this.$refs.show.forEach(item=>{
					item.classList.remove('editing');
				});
				this.$refs.show[index].classList.add('editing')
				this.beforeUpdate = JSON.parse(JSON.stringify(this.dataList[index]))
			},

			//真正的编辑事件
			updateTodo (index) {
				if (!this.dataList[index].content.trim()) return this.dataList.splice(index, 1)
				if (this.dataList[index].content !== this.beforeUpdate.content) this.dataList[index].isFinish = false
				this.$refs.show[index].classList.remove('editing')
				this.beforeUpdate = {}
			},

			//还原内容
			backTodo (index) {
				this.dataList[index].content = this.beforeUpdate.content
				this.$refs.show[index].classList.remove('editing')
				this.beforeUpdate = {}
			},

			//hashchange事件
			hashchange () {
				switch (window.location.hash) {
					case '':
					case '#/':
						this.showAll()
						this.activeBtn = 1
						break
					case '#/active':
						this.activeAll(false)
						this.activeBtn = 2
						break
					case '#/completed':
						this.activeAll(true)
						this.activeBtn = 3
						break
				}
			},

			//创建一个显示的数组
			showAll () {
				this.showArr = this.dataList.map(() => true)
			},

			//修改显示数组的使用
			activeAll (boo) {
				this.showArr = this.dataList.map(item => item.isFinish === boo)
				// 判断是不是有 true
				// 数组里面每一项应该都是 false
				if (this.dataList.every(item => item.isFinish === !boo)) return window.location.hash = '#/'
			}
		},

		//监听
		watch: {
			dataList: {
				handler(newArr){
					window.localStorage.setItem('dataList',JSON.stringify(newArr))
					this.hashchange()
				},
				deep: true
			}
		},

		//计算属性
		computed: {
			activeNum(){
				return this.dataList.filter(item=>!item.isFinish).length
			},
			toggleAll:{
				get(){
					// 判断是不是每一个都是 true，如果每一个都是 true，return true
					// 只要有一个不是 true，return fasle
					return this.dataList.every(item=>item.isFinish)

				},
				
				//设置计算属性
				//只能捕获到你要改变的行为
				//在我想改变的这个行为里面去触发被计算项，让当前这个值重新计算
				set(val){
					// 已经触发了你想改变这个行为
					// 让 dataList 里面的每一项发生变化
					this.dataList.forEach(item=>item.isFinish=val)
				}
			}
		},

		//自定义属性
		directives: {
			focus: {
				inserted(el){
					el.focus()
				}
			}
		},

		//过滤器
		filters: {
			date (val) {
				return val + '  ---  ' + new Date().getDay()
			}
		},

		//生命周期
		created () {
			this.hashchange()
			window.onhashchange = () => {
				this.hashchange()
			}
		}
	})




})(window,Vue);
