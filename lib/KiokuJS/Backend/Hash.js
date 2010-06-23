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
                    return entries[ id ] != null ? me.serializer.deserialize(entries[ id ]) : null 
                }))
            },
            
            
            insert  : function (entriesToInsert, scope) {
                var entries         = this.entries
                var serializer      = this.serializer
                
                var res = Joose.A.map(entriesToInsert, function (entry) {
                    entries[ entry.ID ] = serializer.serialize(entry)
                    
                    return entry.ID
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
