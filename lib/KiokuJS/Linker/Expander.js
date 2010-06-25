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
        
        objects         : Joose.I.Object
    },
    
    
    methods : {
        
        pinObject : function (object, ID) {
            instance.__ID__ = ID
            
            return this.objects[ ID ] = object
        },
        
        
        visitArray  : function (array, className) {
            return Joose.A.map(array, function (value, index) {
                
                return this.visit(value)
                
            }, this)
        },
        
        
        visitObject : function (object, className) {
            var refID = object.$ref
            
            if (refID) {
                if (this.scope.idPinned(refID))
            
                return new KiokuJS.Reference({
                    ID  : object.$ref
                })
            }
            
            if (object.$entry) {
                var node = new this.nodeClass(object)
                
                this.visit(node.entry)
                
                return node
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
            
            outlineNodes   : function (data, scope, nodeClass) {
                
                var instance = new this.constructor({
                    scope       : scope,
                    nodeClass   : nodeClass
                })
                
                return instance.visit(data)
            }
        }                    
    }
})
