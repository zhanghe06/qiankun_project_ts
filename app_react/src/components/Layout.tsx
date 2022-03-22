import {Tabs} from 'antd';
import App from './App';


const {TabPane} = Tabs;

function callback(key: any) {
    console.log(key);
}

export default () => {
    return (
        <Tabs defaultActiveKey="1" onChange={callback}>
            <TabPane tab="应用管理" key="1">
                <App />
            </TabPane>
            <TabPane tab="策略管理" key="2">
                Content of Tab Pane 2
            </TabPane>
            <TabPane tab="邮箱配置" key="3">
                Content of Tab Pane 3
            </TabPane>
        </Tabs>
    );
};
