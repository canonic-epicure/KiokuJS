Class('KiokuJS.Linker.Expander', {
    
    isa         : 'Data.Visitor',
    
    use         : 'KiokuJS.Reference',
    
    does        : 'KiokuJS.Role.Resolvable',
    
    
    has         : {
        reservedKeys    : /^public:(\$ref)$|^public:(\$entry)$/,
        
        nodeClass       : { required : true },
        
        scope           : { required : true },
        
        objects         : Joose.I.Object,
        
        nodes           : { required : true }
    },
    
    
    methods : {
        
        // XXX ugly hack to avoid extra graph scan
        cleanReservedFields : function (object) {
            var res = {}
            
            Joose.O.eachOwn(object, function (value, key) {
                var match 
                
                if (match = this.reservedKeys.exec(key)) key = match[1] || match[2]
                
                res[ key ] = value
            }, this)
            
            return res
        },
        
        
        pinObject : function (object, ID) {
            object.__ID__ = ID
            
            return this.objects[ ID ] = object
        },
        
        
        idPinned : function (id) {
            return this.objects[ id ] != null || this.scope.idPinned(id)
        },
        
        
        idToObject : function (id) {
            return this.objects[ id ] || this.scope.idToObject(id)
        },
        
        
        visitArray  : function (array, className) {
            return Joose.A.map(array, function (value, index) {
                
                return this.visit(value)
                
            }, this)
        },
        
        
        visitJooseInstance : function (node, className) {
            if (!(node instanceof KiokuJS.Node)) throw "Invalid Joose instance [" + node + "] encountered during expanding"
            
            var typeMap = this.getTypeMapFor(node.className)
            
            return typeMap.expand(node, this)
        },
        
        
        visitObject : function (object, className) {
            var refID = object.$ref
            
            if (refID) {
                if (this.idPinned(refID)) return this.idToObject(refID)
                
                var refNode = this.nodes[ refID ]
            
                if (!refNode) throw "Node with ID = [" + refID + "] missed during expanding" 
            
                return this.visit(refNode)
            }
            
            if (object.$entry) {
                object.backend = this.scope.getBackend()
                
                var node = new this.nodeClass(object)
                
                return this.visitJooseInstance(node)
            }
            
            
            var res = {}
            
            Joose.O.eachOwn(object, function (value, key) {
                var match 
                
                if (match = this.reservedKeys.exec(key)) key = match[1]
                
                res[ key ] = this.visit(value)
            }, this)
            
            return res
        }
    },
    
    
    my : {
        
        methods : {
            
            expandNodes   : function (nodes, scope) {
                
                var instance = new this.HOST({
                    nodes       : nodes,
                    scope       : scope,
                    resolver    : scope.getResolver(),
                    nodeClass   : scope.getBackend().nodeClass
                })
                
                return instance.visit(nodes)
            }
        }                    
    }
})
