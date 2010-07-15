Class('KiokuJS.Node', {
    
    does    : 'KiokuJS.Role.Resolvable',
    
    has : {
        // stored attributes
        ID              : null,
        
        className       : null,
        classVersion    : null, 
        traits          : null,
        
        isRoot          : false,
        data            : null,
        
        // run-time attributes
        object      : null,
        
        typeMap     : { 
            is          : 'rwc',
            
            lazy        : 'this.buildTypeMap'
        },
        
        resolver    : {
            is          : 'rw',
            required    : true
        },
        
        entry       : {
            is      : 'ro',
            lazy    : 'this.buildEntry'
        }
    },
    

    methods : {
        
        initialize : function () {
            var object      = this.object
            var className   = this.className
            
            if (!className && !object) throw "Either `object` or `className` with `data` must be supplied during instantion of node [" + this + "]"
            
            if (!className) this.className = this.getClassNameFor(object)
        },
        
        
        isLive : function () {
            return this.object != null
        },
        
        
        isFirstClass : function () {
            return this.ID != null
        },
        
        
        acquireID : function (desiredId) {
            var object  = this.object
            var ID      = this.ID
            
            if (ID) {
                if (desiredId != null && ID != desiredId) throw "Attempt to redefine the ID of [" + object + "] from [" + ID + "] to [" + desiredId + "]"
                
                return
            }
            
            this.ID = this.typeMap().acquireIDFor(object, desiredId)
        },
        
        
        // XXX implement clear/predicate for attribute
        clearEntry : function () {
            delete this.entry
            delete this.data
        },
        
        
        //XXX passthrough the entries from non-firstclass nodes with native typemaps 
        buildEntry   : function () {
            
            var entry = {
                className       : this.className,
                classVersion    : this.classVersion,
                traits          : this.traits,
                
                isRoot          : this.isRoot,
                data            : this.data
            }
            
            if (this.ID != null) entry.ID = this.ID
            
            return entry
        },
        
        
        buildTypeMap : function () {
            return this.getTypeMapFor(this.className)
        },
        
        
        getClass : function () {
            return eval(this.className)
        },
        
        
        collapse : function (collapser) {
            this.data = this.typeMap().collapse(this.object, this, collapser)
        },
        
        
//        refresh : function (instance, data, linker) {
//            throw "Abstract method 'refresh' called for " + this
//        },
        
        
        createEmptyInstance : function () {
            if (this.object) throw "Node [" + this + "] already contain an object instance"
            
            return this.object = this.typeMap().createEmptyInstance(this)
        },
        
        
        populate : function (expander) {
            if (!this.object) throw "Node [" + this + "] doesn't contain the object - can't be expanded"
            
            return this.typeMap().populate(this.object, this, expander)
        }
        
    },
    
    
    my : {
        
        has : {
            HOST    : null
        },
        
        
        methods : {
        
            newFromEntry : function (entry, resolver) {
                if (!entry) return null
                
                entry.resolver   = resolver
                
                return new this.HOST(entry)
            },
            
            
            newFromObject : function (object, resolver) {
                return new this.HOST({
                    object      : object,
                    
                    resolver    : resolver
                })
            }
        }
    }
})