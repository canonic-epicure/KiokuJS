Class('KiokuJS.Node', {
    
    use     : 'Data.Visitor',
    
    does    : 'KiokuJS.Role.Resolvable',
    
    
    has : {
        // stored attributes
        ID              : null,
        
        className       : undefined,
        classVersion    : undefined,
        objTraits       : undefined,
        
        isRoot          : undefined,
        data            : null,
        
        // run-time attributes
        object      : {
            is  : 'rw'
        },
        
        // arbitrary data about object
        objectData  : null,
        
        typeMap     : {
            is      : 'ro',
            lazy    : function () { return this.getTypeMapFor(this.className) }
        },
        
        resolver    : {
            is          : 'rw',
            required    : true
        },
        
        entry       : {
            is      : 'ro',
            lazy    : 'this.buildEntry'
        },
        
        
        selfReference   : {
            is      : 'ro',
            lazy    : 'this.buildSelfReference'
        },
        
        // node will produce separate first-class (extrinisic) entry unless it (or its typemap) has `intrinsic` flag set
        extrinsic   : false,
        
        // node will produce intrinsic entries
        intrinsic   : false,
        
        // node will be skipped from the collapse result (effectively from all store operations)
        immutable   : false,
        
        // node will contain a lazy reference
        lazy        : false
    },
    

    methods : {
        
        initialize : function () {
            var object      = this.object
            var className   = this.className
            
            if (!className && !object) throw "Either `object` or `className` with `data` must be supplied during instantiation of node [" + this + "]"
            
            if (!className) this.className = this.getClassNameFor(object)
        },
        
        
        isLive : function () {
            return this.object != null 
        },
        
        
        isFirstClass : function () {
            return this.ID != null
        },
        
        
        isIntrinsic : function () {
            return this.intrinsic || this.getTypeMap().intrinsic
        },
        
        
        getClass : function () {
            return eval(this.className)
        },
        
        
        acquireID : function (desiredId) {
            var ID      = this.ID
            
            if (ID) {
                if (desiredId != null && ID != desiredId) throw "Attempt to redefine the ID of node [" + this + "] from [" + ID + "] to [" + desiredId + "]"
                
                return
            }
            
            this.ID = this.getTypeMap().acquireID(this, desiredId)
        },
        
        
        // XXX implement clear/predicate for attribute
        clearEntry : function () {
            delete this.entry
        },
        
        
        clearInstance : function () {
            if (!this.object) throw "Node [" + this + "] doesn't contain an object instance to clear"
            
            this.getTypeMap().clearInstance(this)
        },
        
        
        buildEntry   : function () {
            
            var entry = {
                className       : this.className,
                classVersion    : this.classVersion,
                objTraits       : this.objTraits,
                
                isRoot          : this.isRoot,
                data            : this.data
            }
            
            if (this.ID != null) entry.ID = this.ID
            
            return entry
        },
        
        
        buildSelfReference : function () {
            var ref = {
                $ref    : this.ID
            }
            
            if (this.lazy) ref.type = 'lazy'
            
            return ref
        },
        

        collapse : function (collapser) {
            this.data = this.getTypeMap().collapse(this, collapser)
        },
        
        
        createEmptyInstance : function () {
            if (this.object) throw "Node [" + this + "] already contain an object instance"
            
            return this.object = this.getTypeMap().createEmptyInstance(this)
        },
        
        
        populate : function (expander) {
            if (!this.object) throw "Node [" + this + "] doesn't contain the object - can't be expanded"
            
            this.getTypeMap().populate(this, expander)
            
            return this.object
        },
        
        
        consumeOldNode : function (oldNode) {
            this.object = oldNode.object
            
            // this.isRoot = oldNode.isRoot seems this will be returned from DB in entry anyway
            
            // XXX also copy `intrinsic, extrinsic, immutable and lazy` ?
            // seems it will be recalculated during collapsing anyway?
        },
        
        
        afterInsert : function (entry) {
            this.clearEntry()
        }
        
    },
    
    
    my : {
        
        has : {
            HOST    : null
        },
        
        
        methods : {
        
            newFromEntry : function (entry, resolver) {
                entry.resolver   = resolver
                
                return new this.HOST(entry)
            },
            
            
            newFromObject : function (object, resolver) {
                
                Data.Visitor.assignRefAdrTo(object)
                
                return new this.HOST({
                    object      : object,
                    
                    resolver    : resolver
                })
            }
        }
    }
})