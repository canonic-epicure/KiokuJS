/**
 * This class visits the KiokuJS.Node's data structure and inlines the KiokuJS.Nodes into plain JSON
 * Inlining means the replacing the 1st class KiokuJS.Nodes with some objects, recognizable later
 * after inlining, the resulting structure should be suitable for serialization
 */

Class('KiokuJS.Linker.Expander', {
    
    isa         : 'Data.Visitor',
    
    use         : 'KiokuJS.Reference',
    
    
    has         : {
        reservedKeys    : /^public:(\$ref)$|^public:(\$entry)$/,
        
        nodeClass       : { required : true },
        
        scope           : { required : true },
        
        objects         : Joose.I.Object,
        
        nodes           : { required : true }
    },
    
    
    methods : {
        
        // XXX add resolver role with this method and 'resolver' attribute?
        getTypeMapFor : function (className) {
            var typeMap = this.scope.getResolver().resolveSingle(className)
            
            if (!typeMap) throw "Can't find TypeMap entry for className = [" + className + "]"
            
            return typeMap
        },
        
        
        pinObject : function (object, ID) {
            instance.__ID__ = ID
            
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
            
                return this.visit(this.nodes[ refID ])
            }
            
            if (object.$entry) {
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
                
                var instance = new this.constructor({
                    nodes       : nodes,
                    scope       : scope,
                    nodeClass   : scope.getBackend().nodeClass
                })
                
                return instance.visit(nodes)
            }
        }                    
    }
})
