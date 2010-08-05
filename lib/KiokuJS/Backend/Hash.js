Class('KiokuJS.Backend.Hash', {
    
    isa   : 'KiokuJS.Backend',
    
    
    has : {
        entries         : Joose.I.Object
    },
    
        
    continued : {
        
        methods : {
            
            get     : function (idsToGet, scope, mode) {
                var entries = this.entries
                
                var strings = Joose.A.map(idsToGet, function (id) {
                    return entries[ id ] ||  null 
                })
                
                var nodes       = this.deserializeNodes(strings)
                
                var CONTINUE    = this.getCONTINUE()
                
                setTimeout(function () {
                    CONTINUE(nodes)
                }, 0)
            },
            
            
            insert  : function (nodes, scope, mode) {
//                debugger
                
                var entries             = this.entries
                var stringifiedEntries  = this.serializeNodes(nodes)
                
                var ids = Joose.A.map(nodes, function (node, index) {
                    
                    var ID  = node.ID
                    
                    if (mode == 'insert' && entries[ ID ]) 
                        throw new KiokuJS.Exception.Overwrite({
                            message : "Attempt to overwrite entry with ID = [" + ID + "], old value = [" + entries[ ID ] + "], new value [" + stringifiedEntries[ index ] + "]"
                        })
                    
                    entries[ ID ] = stringifiedEntries[ index ]
                    
                    return ID
                })
                
                var CONTINUE = this.getCONTINUE()
                
                setTimeout(function () {
                    CONTINUE(ids)
                }, 0)
            },
            
            
            remove  : function (idsToRemove) {
                var entries = this.entries
                
                Joose.A.each(idsToRemove, function (id) {
                    delete entries[ id ]
                })
                
                setTimeout(this.getCONTINUE(), 0)
            },
            
            
            exists  : function (idsToCheck) {
                var entries = this.entries
                
                var checks = Joose.A.map(idsToCheck, function (id) {
                    return entries[ id ] != null
                })
                
                var CONTINUE = this.getCONTINUE()
                
                setTimeout(function () {
                    CONTINUE(checks)
                }, 0)
                
            }
        }
    }

})
