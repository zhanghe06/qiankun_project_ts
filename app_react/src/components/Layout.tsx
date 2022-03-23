import {Tabs} from 'antd';
import Cert from './cert/Index';
import Strategy from './strategy/Index';
import './Layout.css'


const {TabPane} = Tabs;

function callback(key: any) {
    // console.log(key);
}

export default () => {
    return (
        <Tabs defaultActiveKey="1" onChange={callback}>
            <TabPane tab="应用管理" key="1">
                <Cert />
            </TabPane>
            <TabPane tab="策略管理" key="2">
                <Strategy />
            </TabPane>
            <TabPane tab="邮箱配置" key="3">
                暂未开通
            </TabPane>
        </Tabs>
    );
};
