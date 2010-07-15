Class('KiokuJS.Collapser.Encoder', {
    
    isa         : 'Data.Visitor',
    
    
    use         : [ 'KiokuJS.Reference', 'KiokuJS.Node' ],
    

    has         : {
        reservedKeys : /^\$ref$|^\$entry$/
    },
    
    
    methods : {
        
        createReference : function (nodeOrRef) {
            return {
                $ref : nodeOrRef.ID
            }
        },
        
        
        markEntry : function (entry) {
            entry.$entry = true
            
            return entry
        },
        
        
        visitNode : function (node, needEntry) {
            if (node.isFirstClass() && !needEntry) return this.createReference(node)
            
            var entry = this.visit(node.getEntry())
            
            return this.markEntry(entry)
        },
        
        
        visitReference : function (reference) {
            return this.createReference(reference)
        },
        
        
        visitJooseInstance : function (node, className) {
            if (node instanceof KiokuJS.Node) return this.visitNode(node)

            if (node instanceof KiokuJS.Reference) return this.visitReference(node)

            throw "Invalid Joose instance [" + node + "] encountered during inlining - only `KiokuJS.Node` and `KiokuJS.Reference` allowed"
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
            
            encodeNodes : function (nodes) {
                
                var instance = new this.HOST()
                
                return Joose.A.map(nodes, function (node) {
                    
                    return instance.visitNode(node, true)
                })
            }
        }                    
    }
})
