Class('KiokuJS.Collapser.Encoder', {
    
    isa         : 'Data.Visitor',
    

    has         : {
        reservedKeys : /^\$ref$|^\$entry$/
    },
    
    
    methods : {
        
        createReference : function (nodeOrRef) {
            return {
                $ref : nodeOrRef.ID
            }
        },
        
        
        visitJooseInstance : function (node, className) {
            var isNode  = node instanceof KiokuJS.Node
            var isRef   = node instanceof KiokuJS.Reference
            
            if (!isNode && !isRef) throw "Invalid Joose instance [" + node + "] encountered during inlining - only KiokuJS.Node and KiokuJS.Reference allowed"
            
            if (isNode && node.isFirstClass() || isRef) return this.createReference(node)
            
            var entry = node.getEntry()
            
            entry.$entry = true
            
            return entry
        },
        
        
        // a bit faster visiting of array
        visitArray  : function (array, className) {
            return Joose.A.map(array, function (value) {
                
                return this.visit(value)
                
            }, this)
        },
        
        
        visitObject : function (object, className) {
            var res = {}
            
            Joose.O.eachOwn(object, function (value, key) {
                
                if (this.reservedKeys.test(key)) key = 'public:' + key
                
                res[ key ] = this.visit(value)
            }, this)
            
            return res
        }
    },
    
    
    my : {

        methods : {
            
            inlineNodes : function (data) {
                return this.visit(data)
            }
        }                    
    }
})
