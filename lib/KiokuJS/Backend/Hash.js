Class('KiokuJS.Backend.Hash', {
    
    isa   : 'KiokuJS.Backend',
    
    
    has : {
        entries         : Joose.I.Object
    },
    
        
    continued : {
        
        methods : {
            
            get     : function (idsToGet) {
                var entries = this.entries
                var me      = this
                
                var res = Joose.A.map(idsToGet, function (id) {
                    return entries[ id ] != null ? me.deserializeNode(entries[ id ]) : null 
                })
                
                var CONTINUE = this.getCONTINUE()
                
                setTimeout(function () {
                    CONTINUE(res)
                }, 1)
            },
            
            
            insert  : function (nodesToInsert, scope) {
                var entries         = this.entries
                var me              = this
                
                var res = Joose.A.map(nodesToInsert, function (node) {
                    entries[ node.ID ] = me.serializeNode(node)
                    
                    return node.ID
                })
                
                var CONTINUE = this.getCONTINUE()
                
                setTimeout(function () {
                    CONTINUE(res)
                }, 1)
            },
            
            
            remove  : function (idsToRemove) {
                var entries = this.entries
                
                Joose.A.each(idsToRemove, function (id) {
                    delete entries[ id ]
                })
                
                setTimeout(this.getCONTINUE(), 1)
            },
            
            
            exists  : function (idsToCheck) {
                var entries = this.entries
                
                var res = Joose.A.map(idsToCheck, function (id) {
                    return entries[ id ] != null
                })
                
                var CONTINUE = this.getCONTINUE()
                
                setTimeout(function () {
                    CONTINUE(res)
                }, 1)
                
            }
        }
    }

})
