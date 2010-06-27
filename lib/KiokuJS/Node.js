Class('KiokuJS.Node', {
    
    
    has : {
        // stored attributes
        ID              : null,
        
        className       : { required    : true },
        classVersion    : null, 
        traits          : null,
        
        isRoot      : false,
        
        entry       : {
            is      : 'ro',
            lazy    : 'this.buildEntry'
        },
        
        
        // run-time attributes
        object      : null,
        typeMap     : null,
        backend     : { required : true },
        
        data        : null
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
            
            
            this.ID = object.__ID__ = this.typeMap.acquireIDFor(object, desiredId)
        },
        
        
        // the KiokuJS.Node supposed to be re-instantiateable from the `entry` data structure
        // it will be passed to constructor by backend
        buildEntry   : function () {
            
            var entry = {
                
                $entry          : true,
                
                className       : this.className,
                
                // XXX extract version and traits
                classVersion    : null,
                traits          : null,
                
                isRoot          : this.isRoot,
                entry           : this.backend.inlineNodes(this.data)
            }
            
            if (this.ID != null) entry.ID = this.ID
            
            return entry
        }
    }
})