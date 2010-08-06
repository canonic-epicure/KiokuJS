Class('KiokuJS.Backend.Hash', {
    
    isa   : 'KiokuJS.Backend',
    
    
    has : {
        entries         : Joose.I.Object
    },
    
    
    does    : [ 'KiokuJS.Backend.Feature.Overwrite', 'KiokuJS.Backend.Feature.Update' ],
    
    
    use     : [ 'KiokuJS.Exception.Overwrite', 'KiokuJS.Exception.Update' ],
    
        
    continued : {
        
        methods : {
            
            get     : function (idsToGet, scope, mode) {
                var entries = this.entries
                
                var strings = Joose.A.map(idsToGet, function (id) {
                    
                    if (entries[ id ]) return entries[ id ]
                    
                    throw new KiokuJS.Exception.LookUp({ message : "Can't find the id [" + id + "] in the backend" }) 
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
                    
                    if (mode == 'update' && !entries[ ID ]) //debugger 
                        throw new KiokuJS.Exception.Update({
                            message : "Attempt to update entry with ID = [" + ID + "], value = [" + stringifiedEntries[ index ] + "], but no such entry in storage"
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
                    
                    if (id instanceof KiokuJS.Node) id = id.ID
                    
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
