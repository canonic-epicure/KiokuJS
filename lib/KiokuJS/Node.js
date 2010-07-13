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
            
            this.ID = this.typeMap.acquireIDFor(object, desiredId)
        },
        
        
        // XXX implement clear/predicate for attribute
        clearEntry : function () {
            delete this.entry
            delete this.data
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
            this.data = this.typeMap.collapse(this.object, this, collapser)
        },
        
        
//        refresh : function (instance, data, linker) {
//            throw "Abstract method 'refresh' called for " + this
//        },
        
        
        createEmptyInstance : function () {
            if (this.object) throw "Node [" + this + "] already contain an object instance"
            
            return this.object = this.typeMap.createEmptyInstance(node, className)
        },
        
        
        populate : function (expander) {
            if (!this.object) throw "Node [" + this + "] doesn't contain the object - can't be expanded"
            
            return this.typeMap.populate(this.object, this, expander)
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
        },
        
        
        newFromObject : function (object, backend) {
            return new this.HOST({
                object      : object,
                className   : backend.getClassNameFor(object),
                
                backend     : backend,
                typeMap     : backend.getTypeMapFor(entry.className)
            })
        }
    }
})