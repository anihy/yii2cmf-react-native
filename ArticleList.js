import React, { Component } from 'react';
import {
    View,
    Text,
    ListView,
    TouchableOpacity,
    StyleSheet
} from 'react-native';
import ArticleItem from './ArticleItem';
import ArticleDetailScreen from './ArticleDetailScreen';
import GlobalConfig from './GlobalConfig';
var API_URL = GlobalConfig.apiUrl.articleList;
export default class ArticleList extends Component
{
    constructor(props) {
        super(props);
        this.state = {
            dataSource: new ListView.DataSource({
                rowHasChanged: (row1, row2) => row1 !== row2,
            }),
            loaded: false,
            page:1
        };
    }
    componentDidMount() {
        this.fetchData();
    }
    fetchData() {
        REQUEST_URL = API_URL + '?module=base&page=' + this.state.page;
        fetch(REQUEST_URL)
        .then((response) => response.json())
        .then((responseData) => {
            const items = responseData.items;
            this.setState({
                dataSource: this.state.dataSource.cloneWithRows(items),
                loaded: true,
            });
        })
        .done();
        this.state.page++;
    }
    renderLoadingView() {
        return (
            <View style={styles.row}>
                <Text>
                    Loading...
                </Text>
            </View>
        );
    }
    render() {
        if(!this.state.loaded) {
            return this.renderLoadingView();
        }

        return (
            <ListView
                dataSource={this.state.dataSource}
                renderRow={this.renderArticle.bind(this)}
            />
        );
    }
    onEndReached() {
        this.fetchData();
    }
    renderArticle(article) {
        return (
            <ArticleItem
                article={article}
                onPress={() => this.selectArticle(article)}
            />
        );
    }
    selectArticle(article) {
        this.props.navigator.push({
            name: '详情',
            Component: ArticleDetailScreen,
            params:{
                articleID:article.id
            }
        })
    }
}

const styles = StyleSheet.create({
  row: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 10,
    marginLeft: 10,
    marginRight: 10,
    marginVertical: 5,
    borderColor: '#dddddd',
    borderStyle: null,
    borderWidth: 0.5,
    borderRadius: 2,
  }
});