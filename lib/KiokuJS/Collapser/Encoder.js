Class('KiokuJS.Collapser.Encoder', {
    
    isa         : 'Data.Visitor',
    
    
    use         : [ 'KiokuJS.Reference', 'KiokuJS.Node' ],
    

    has         : {
        reservedKeys : /^\$ref$|^\$entry$/
    },
    
    
    methods : {
        
        encodeEntry : function (entry, node) {
            
            if (node.isFirstClass() || !node.getTypeMap().passThrough) {
                entry = this.visit(entry)
                
                entry.$entry = true
                 
                return entry
            }

            //passthrough the entries from non-firstclass nodes with native typemaps: [], {} 
            return this.visit(entry.data)
        },
        
        
        visitNode : function (node, needEntry) {
            if (node.isFirstClass() && !needEntry) return node.getReference()
            
            return this.encodeEntry(node.getEntry(), node)
        },
        
        
        visitJooseInstance : function (node, className) {
            if (node instanceof KiokuJS.Node) return this.visitNode(node)

            throw "Invalid Joose instance [" + node + "] encountered during inlining - only `KiokuJS.Node` allowed"
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
