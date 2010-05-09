Class('JiojuDB.Collapser.Inliner.JSPON', {
    
    isa         : 'JiojuDB.Collapser.Inliner',
    
    
    methods : {
        
        visitFirstClassNode : function (node) {
            return {
                '$ref' : node.ID
            }
        }
    }
})
