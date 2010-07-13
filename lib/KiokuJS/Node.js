Class('KiokuJS.Node', {
    
    
    has : {
        // stored attributes
        ID              : null,
        
        className       : { required    : true },
        classVersion    : null, 
        traits          : null,
        
        isRoot      : false,
        data        : null,
        
        // run-time attributes
        object      : null,
        typeMap     : { required : true },
        backend     : { required : true },
        
        entry       : {
            is      : 'ro',
            lazy    : 'this.buildEntry'
        }
    },
    

    methods : {
        
        initialize : function () {
            var object = this.object
            
            var ID = object && object.__ID__
            
            if (ID != null) this.ID = ID
        },
        
        
        isFirstClass : function () {
            return this.ID != null
        },
        
        
        acquireID : function (desiredId) {
            var object  = this.object
            var ID      = object.__ID__
            
            if (ID) {
                if (desiredId != null && ID != desiredId) throw "Attempt to redefine the ID of [" + object + "] from [" + ID + "] to [" + desiredId + "]"
                
                this.ID = ID
                
                return
            }
            
            this.ID = this.typeMap.acquireIDFor(object, desiredId)
        },
        
        
        // the KiokuJS.Node supposed to be re-instantiateable from the `entry` data structure
        // it will be passed to constructor by backend
        buildEntry   : function () {
            
            var entry = {
                
                $entry          : true,
                
                className       : this.className,
                classVersion    : this.classVersion,
                traits          : this.traits,
                
                isRoot          : this.isRoot,
                data            : this.backend.inlineNodes(this.data)
            }
            
            if (this.ID != null) entry.ID = this.ID
            
            return entry
        },
        
        
        getClass : function () {
            return eval(this.className)
        },
        
        
        collapse : function (collapser) {
            throw "Abstract method 'collapse' called for " + this
        },
        
        
//        refresh : function (instance, data, linker) {
//            throw "Abstract method 'refresh' called for " + this
//        },
        
        
        expand : function (instance, node, expander) {
            throw "Abstract method 'expand' called for " + this
        }
        
    },
    
    my : {
        
        has : {
            HOST    : null
        },
        
        
        newFromEntry : function (entry, backend) {
            entry.backend   = backend
            entry.typeMap   = backend.getTypeMapFor(entry.className)
            
            delete entry.$entry
            
            return new this.HOST(entry)
        }
    }
})