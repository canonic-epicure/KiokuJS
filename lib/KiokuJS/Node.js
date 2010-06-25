Class('KiokuJS.Node', {
    
    
    has : {
        
        ID          : null,
        
        object      : null,
        className   : { required    : true },
        
        typeMap     : { required    : true },
        backend     : { required    : true },
        
        data        : null,
        
        isRoot      : false,
        
        entry       : {
            is      : 'ro',
            lazy    : 'this.buildEntry'
        }
    },
    

    methods : {
        
        initialize : function () {
            var ID = this.object.__ID__
            
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
            
            if (this.ID) entry.ID = this.ID
            
            return entry
        }
    }
})