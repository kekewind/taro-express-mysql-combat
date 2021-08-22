import { Component } from 'react'
import Taro, { createSelectorQuery, getSystemInfoSync } from '@tarojs/taro'
import { View, ScrollView, Block } from '@tarojs/components'
import PropTypes from 'prop-types'

/**
 * 虚拟列表
 * @param	{Array}	list  列表数据
 * @param	{String}	listId  虚拟列表唯一id（防止同一个页面有多个虚拟列表导致渲染错乱）
 * @param	{Number}	segmentNum  自定义分段的数量，默认10
 * @param	{Boolean}	autoScrollTop  组件内部是否需要根据list数据变化自动滚动至列表顶部
 * @param	{Number}	screenNum  指定页面显示区域基准值，例如2，则组件会监听 2 * scrollHeight高度的上下区域(该值会影响页面真实节点的渲染数量)
 * @param	{Object}	scrollViewProps  scrollView的参数
 * @param	{Function}	onBottom  二维列表是否已经触底回调
 * @param	{Function}	onComplete  二维列表是否已经把全部数据加载完成的回调
 * @param	{Function}	onRender  二维列表Item的渲染回调
 * @param	{Function}	onRenderTop  二维列表上部分内容渲染回调
 * @param	{Function}	onRenderBottom  二维列表下部分内容渲染回调
 */
export default class VirtialList extends Component {
  constructor(props) {
    super(props)
    this.state = {
      wholePageIndex: 0, // 每一屏为一个单位，屏幕索引
      twoList: [], // 二维数组
      isComplete: false, // 数据是否全部加载完成
      innerScrollTop: 0, // 记录组件内部的滚动高度
    }
    this.pageHeightArr = [] // 用来装每一屏的高度
    this.initList = [] // 承载初始化的二维数组
    this.windowHeight = 0 // 当前屏幕的高度
    this.currentPage = Taro.getCurrentInstance()
  }

  componentDidMount() {
    const { list } = this.props
    this.getSystemInformation()
    this.formatList(list)
  }
  UNSAFE_componentWillReceiveProps(nextProps) {
    const { list } = this.props
    // 提前把innerScrollTop置为不是0，防止列表置顶失效
    this.setState({
      innerScrollTop: 1,
    })

    if (JSON.stringify(nextProps.list) !== JSON.stringify(list)) {
      this.pageHeightArr = []
      this.setState({
        wholePageIndex: 0,
        isComplete: false,
        twoList: [],
        innerScrollTop: 0,
      }, () => {
        if (nextProps.list?.length) {
          this.formatList(nextProps.list)
        } else {
          this.handleComplete()
        }
      })
    }
    if (!nextProps.list?.length) {
      // list为空
      this.handleComplete()
    }
  }
  
  getSystemInformation = () => {
    try {
      const res = getSystemInfoSync()
      this.windowHeight = res.windowHeight
    } catch (err) {
      console.error(`获取系统信息失败：${err}`)
    }
  }
  /**
   * 列表数据渲染完成
   */
  handleComplete = () => {
    const { onComplete } = this.props
    this.setState({
      isComplete: true,
    }, () => {
      onComplete?.()
    })
  }
  /**
   * 按规则分割list，存在私有变量initList，备用
   */
  segmentList = (list = []) =>{
    const { segmentNum } = this.props
    let arr = []
    const _list = []
    list.forEach((item, index) => {
      arr.push(item)
      if ((index + 1) % segmentNum === 0) {
        _list.push(arr)
        arr = []
      }
    })
    // 将分段不足segmentNum的剩余数据装入_list
    const restList = list.slice(_list.length * segmentNum)
    if (restList?.length) {
      _list.push(restList)
      if (_list.length <= 1) {
        // 如果数据量少，不足一个segmentNum，则触发完成回调
        this.handleComplete()
      }
    }
    this.initList = _list
  }
  /**
   * 将列表格式化为二维
   * @param	list 	列表
   */
  formatList(list = []) {
    this.segmentList(list)
    this.setState({
      twoList: this.initList.slice(0, 1),
    }, () => {
      Taro.nextTick(() => {
        this.setHeight(list)
      })
    })
  }
  renderNext = () => {
    const { onBottom, list } = this.props
    const page_index = this.state.wholePageIndex + 1
    if (!this.initList[page_index]?.length) {
      this.handleComplete()

      return
    }
    onBottom?.()

    this.setState({
      wholePageIndex: page_index,
    }, () => {
      const { wholePageIndex, twoList } = this.state
      twoList[wholePageIndex] = this.initList[wholePageIndex]
      this.setState({
        twoList: [...twoList],
      }, () => {
        Taro.nextTick(() => {
          this.setHeight(list)
        })
      })
    })
  }
  /**
   * 设置每一个维度的数据渲染完成之后所占的高度
   */
  setHeight(list = []) {
    const { wholePageIndex } = this.state
    const { listId } = this.props
    const query = createSelectorQuery()
    query.select(`#${listId} .wrap_${wholePageIndex}`).boundingClientRect()
    query.exec((res) => {
      // 有数据的时候才去收集高度，不然页面初始化渲染（在H5中无数据）收集到的高度是错误的
      if (list?.length) {
        this.pageHeightArr.push(res?.[0]?.height)
      }
    })
    this.miniObserve()
  }
  /**
   * 小程序平台监听
   */
  miniObserve = () => {
    const { wholePageIndex } = this.state
    const { scrollViewProps, listId, screenNum } = this.props
    // 以传入的scrollView的高度为相交区域的参考边界，若没传，则默认使用屏幕高度
    const scrollHeight = scrollViewProps?.style?.height || this.windowHeight
    const observer = Taro.createIntersectionObserver(this.currentPage.page).relativeToViewport({
      top: screenNum * scrollHeight,
      bottom: screenNum * scrollHeight,
    })
    observer.observe(`#${listId} .wrap_${wholePageIndex}`, (res) => {
      const { twoList } = this.state
      if (res?.intersectionRatio <= 0) {
        // 当没有与当前视口有相交区域，则将改屏的数据置为该屏的高度占位
        twoList[wholePageIndex] = { height: this.pageHeightArr[wholePageIndex] }
        this.setState({
          twoList: [...twoList],
        })
      } else if (!twoList[wholePageIndex]?.length) {
        // 如果有相交区域，则将对应的维度进行赋值
        twoList[wholePageIndex] = this.initList[wholePageIndex]
        this.setState({
          twoList: [...twoList],
        })
      }
    })
  }

  render() {
    const {
      twoList,
      isComplete,
      innerScrollTop,
    } = this.state
    const {
      segmentNum,
      scrollViewProps,
      onRenderTop,
      onRenderBottom,
      onRender,
      listId,
      className,
      autoScrollTop,
    } = this.props

    const scrollStyle = {
      height: '100%',
    }

    const _scrollViewProps = {
      ...scrollViewProps,
      scrollTop: autoScrollTop ? (innerScrollTop === 0 ? 0 : "") : scrollViewProps?.scrollTop,
    }

    return (
      <ScrollView
        scrollY
        id={listId}
        style={scrollStyle}
        onScrollToLower={this.renderNext}
        lowerThreshold={250}
        className={`zt-virtual-list-container ${className}`}
        {..._scrollViewProps}
        onScroll={this.handleScroll}
      >
        {onRenderTop?.()}
        <View className="zt-main-list">
          {
            twoList?.map((item, pageIndex) => {
              return (
                <View key={pageIndex} className={`wrap_${pageIndex}`}>
                  {
                    item?.length > 0 ? (
                      <Block>
                        {
                          item.map((el, index) => {
                            return onRender?.(el, (pageIndex * segmentNum + index), pageIndex)
                          })
                        }
                      </Block>
                    ) : (
                      <View style={{'height': `${item?.height}px`}}></View>
                    )
                  }
                </View>
              )
            })
          }
        </View>
        {isComplete && onRenderBottom?.()}
      </ScrollView>
    )
  }
}

VirtialList.defaultProps = {
  list: [],
  listId: "zt-virtial-list",
  segmentNum: 10,
  screenNum: 2,
  scrollViewProps: {},
  className: "",
  autoScrollTop: true,
  onRender: function render() {
    return (<View />)
  },
}

VirtialList.propTypes = {
  list: PropTypes.array.isRequired,
  listId: PropTypes.string,
  segmentNum: PropTypes.number,
  screenNum: PropTypes.number,
  autoScrollTop: PropTypes.bool,
  scrollViewProps: PropTypes.object,
  onRender: PropTypes.func.isRequired,
  onBottom: PropTypes.func,
  onComplete: PropTypes.func,
  onRenderTop: PropTypes.func,
  onRenderBottom: PropTypes.func,
}