contractAbi = [
    {
        "constant":false,
        "inputs":[
            {
                "name":"data",
                "type":"uint256"
                },
                {"name":"summ",
                "type":"uint256"},
                {"name":"price",
                "type":"uint256"},{"name":"subThresh","type":"uint256"},{"name":"timeThresh","type":"uint256"}],"name":"setPrice","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"data","type":"uint256"},{"name":"summ","type":"uint256"}],"name":"getPrice","outputs":[{"name":"price","type":"uint256"},{"name":"lastUpdate","type":"uint256"},{"name":"subThresh","type":"uint256"},{"name":"timeThresh","type":"uint256"},{"name":"subCount","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"user","type":"address"},{"name":"data","type":"uint256"},{"name":"summ","type":"uint256"},{"name":"volume","type":"uint256"}],"name":"payUser","outputs":[],"payable":false,"type":"function"},{"inputs":[],"type":"constructor"}]