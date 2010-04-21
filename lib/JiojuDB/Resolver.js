Class('JiojuDB.Resolver', {
    
    
    has : {
        entries     : Joose.I.Array,
        
        parent      : null,
        
        cache       : Joose.I.Object
    },
    
    
    // XXX move attr initialization into constructor
    after : {
        
        initialize : function () {
            
            var entries     = this.entries
            
            Joose.A.each(entries, function (entry, index) {
                    
                entries[ index ] = this.prepareEntry(entry)
                
            }, this)
        }
    },
    
        
    methods : {
        
        BUILD   : function (param) {
            if (param instanceof Array) return {
                entries : param
            }
            
            return this.SUPERARG(arguments)
        },
        
        
        prepareEntry : function (entry) {
            if (!entry) throw "Can't add empty entry to resolver : " + this
            
            if (!Joose.O.isInstance(entry)) {
                var entryClass = entry.meta
                delete entry.meta
                
                entry = new entryClass(entry)
            }
            
            if (entry instanceof JiojuDB.Resolver) entry.parent = this 
            
            return entry
        },
        

        //XXX implement full CRUD for entries
        addEntry : function (entry) {
            this.entries.push(this.prepareEntry(entry))
            
            this.discardCache()
        },
        
        
        getEntryAt : function (index) {
            return this.entries[ index ]
        },
        
        
        discardCache : function () {
            this.cache = {}
            
            if (this.parent) this.parent.discardCache()
        },
        
        
        resolve : function (className) {
            var cache = this.cache
            
            if (cache[ className ]) return cache[ className ]
            
            
            var typeMap
            
            Joose.A.each(this.entries, function (entry) {
                
                if (entry instanceof JiojuDB.Resolver) { 
                    typeMap = entry.resolve(className)
                    
                    if (typeMap) return false
                } else 
                    if (entry instanceof JiojuDB.TypeMap) { 
                        
                        if (entry.canHandle(className)) {
                            typeMap = entry 
                            return false
                        }
                    } else
                        throw "Invalid entry [" + entry + "] in resolver + [" + this + "]"
            })
            
            if (typeMap) return cache[ className ] = typeMap
        }
    }

})
