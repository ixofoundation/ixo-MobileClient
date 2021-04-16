const React = require('react'),
    {VictoryBar, VictoryChart, VictoryAxis} =require( 'victory-native'),
    {LinearGradient, Defs, Stop} = require('react-native-svg')

const data = [
    {quarter: 1, earnings: 13000},
    {quarter: 2, earnings: 16500},
    {quarter: 3, earnings: 14250},
    {quarter: 4, earnings: 19000},
    {quarter: 5, earnings: 19000},
    {quarter: 6, earnings: 19000},
    {quarter: 7, earnings: 19000},
    {quarter: 8, earnings: 17000},
    {quarter: 9, earnings: 13000},
    {quarter: 10, earnings: 9000},
    {quarter: 11, earnings: 13000},
    {quarter: 12, earnings: 16500},
    {quarter: 13, earnings: 14250},
    {quarter: 14, earnings: 19000},
]

const WalletChart = () => {
    const maxValue = Math.max(...data.map(({earnings}) => earnings))
    return <VictoryChart
        padding={{top: 40, left: 20, right: 60, bottom: 60}}
        style={{fill: '#002233'}}
    >
        <Defs>
            <LinearGradient id="gradient2"
                x1="0%" y1="0%" x2="0%" y2="100%"
            >
                <Stop offset="0%" stopColor="#002233"/>
                <Stop offset="100%" stopColor="#033C50"/>
            </LinearGradient>
        </Defs>
        <VictoryBar
            data={data.map((v) => ({...v, earnings: maxValue}))}
            x="quarter" y="earnings" 
            cornerRadius={{top: 10, bottom: 10}}
            style={{
                data: {
                    fill: 'url(#gradient2)',
                },
            }}

        />

        <Defs>
            <LinearGradient id="gradient1"
                x1="0%" y1="0%" x2="0%" y2="100%"
            >
                <Stop offset="0%" stopColor="#03D0FB"/>
                <Stop offset="100%" stopColor="#016480"/>
            </LinearGradient>
        </Defs>
        <VictoryBar 
            data={data}
            x="quarter" y="earnings" 
            cornerRadius={{top: 5, bottom: 5}}
            colorScale={[
                'url(#gradient1)',
            ]}
            style={{
                data: {
                    fill: 'url(#gradient1)',
                },
            }}

        />
        <VictoryAxis
        
            style={{
                axis: {stroke: 'transparent'}, 
                tickLabels: {stroke: 'white'},
            }}
    
        />
        <VictoryAxis dependentAxis
            orientation='right'
            style={{
                axis: {stroke: 'transparent'}, 
                tickLabels: {stroke: '#809EAC'},
            }}
    
        />
    </VictoryChart>
}

module.exports = WalletChart