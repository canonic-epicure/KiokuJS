Class('KiokuJS.Collapser.Inliner.JSPON', {
    
    isa         : 'KiokuJS.Collapser.Inliner',
    
    
    methods : {
        
        visitFirstClassNode : function (node) {
            return {
                $ref : node.ID
            }
        }
    }
})
