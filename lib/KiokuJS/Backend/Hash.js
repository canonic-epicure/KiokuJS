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
                
                this.CONTINUE(Joose.A.map(idsToGet, function (id) {
                    return entries[ id ] != null ? me.deserializeNode(entries[ id ]) : null 
                }))
            },
            
            
            insert  : function (nodesToInsert, scope) {
                var entries         = this.entries
                var me              = this
                
                var res = Joose.A.map(nodesToInsert, function (node) {
                    entries[ node.ID ] = me.serializeNode(node)
                    
                    return node.ID
                })
                
                this.CONTINUE(res)
            },
            
            
            remove  : function (idsToRemove) {
                var entries = this.entries
                
                Joose.A.each(idsToRemove, function (id) {
                    delete entries[ id ]
                })
                
                this.CONTINUE()
            },
            
            
            exists  : function (idsToCheck) {
                var entries = this.entries
                
                this.CONTINUE(Joose.A.map(idsToCheck, function (id) {
                    return entries[ id ] != null
                }))
            }
        }
    }

})
